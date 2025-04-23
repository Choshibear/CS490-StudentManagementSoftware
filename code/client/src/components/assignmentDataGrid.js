import React, { useEffect, useState } from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import axios from "axios";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons
} from '@mui/x-data-grid';

function EditToolbar({ setFilterCourse, assignments, courses, assignmentTypes, setAssignments, setRowModesModel, selectedCourse }) {
  const handleAddClick = () => {
    const tempId = Date.now();
    const defaultCourse = selectedCourse || courses[0]?.courseName || "";
    const defaultType = assignmentTypes[0]?.typeName || "";

    const newRow = {
      assignmentId: tempId,
      typeName: defaultType,
      assignmentName: "",
      description: "",
      dueDate: new Date().toISOString().split('T')[0],
      possiblePoints: 100,
      weight: 0.1,
      courseName: defaultCourse,
      isNew: true,
    };
    
    setAssignments(prev => [...prev, newRow]);
    setRowModesModel(prev => ({
      ...prev,
      [tempId]: { mode: GridRowModes.Edit, fieldToFocus: "assignmentName" },
    }));
  };

  return (
    <GridToolbarContainer sx={toolbarStyles}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel shrink sx={inputLabelStyles}>Filter by Course</InputLabel>
        <Select 
          value={selectedCourse} 
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <MenuItem value="">All Courses</MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.courseId} value={course.courseName}>
              {course.courseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddClick}
        sx={{ marginLeft: "auto" }}
      >
        Add Assignment
      </Button>
    </GridToolbarContainer>
  );
}

const AssignmentDataGrid = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [assignmentTypes, setAssignmentTypes] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentsRes, coursesRes, typesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/assignments"),
          axios.get("http://localhost:5000/api/courses"),
          axios.get("http://localhost:5000/api/assignmenttypes")
        ]);
        
        setCourses(coursesRes.data);
        setAssignmentTypes(typesRes.data);
        
        const mergedData = assignmentsRes.data.map(assignment => ({
          ...assignment,
          courseName: coursesRes.data.find(c => c.courseId === assignment.courseId)?.courseName || "",
          typeName: typesRes.data.find(t => t.typeId === assignment.assignmentTypeID)?.typeName || ""
        }));

        setAssignments(mergedData);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    };
    fetchData();
  }, []);

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    setAssignments(prev => prev.filter(row => row.assignmentId !== id || !row.isNew));
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const processRowUpdate = async (newRow) => {
    try {
      const course = courses.find(c => c.courseName === newRow.courseName);
      const type = assignmentTypes.find(t => t.typeName === newRow.typeName);
      
      if (!course || !type) {
        throw new Error("Course or Type not found");
      }

      const payload = {
        assignmentName: newRow.assignmentName,
        description: newRow.description,
        dueDate: newRow.dueDate,
        possiblePoints: newRow.possiblePoints,
        weight: newRow.weight,
        courseId: course.courseId,
        assignmentTypeID: type.typeId
      };

      const { data: savedAssignment } = newRow.isNew
        ? await axios.post('http://localhost:5000/api/assignments', payload)
        : await axios.put(`http://localhost:5000/api/assignments/${newRow.assignmentId}`, payload);

      const updatedRow = {
        ...savedAssignment,
        courseName: course.courseName,
        typeName: type.typeName,
        isNew: false
      };

      setAssignments(prev => {
        if (newRow.isNew) {
          return [...prev.filter(r => r.assignmentId !== newRow.assignmentId), updatedRow];
        } else {
          return prev.map(r =>
            r.assignmentId === newRow.assignmentId ? updatedRow : r);
        }
      });

      return updatedRow;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${id}`);
      setAssignments(prev => prev.filter(r => r.assignmentId !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    { field: 'assignmentId', headerName: 'ID', width: 60, editable: false },
    { 
      field: 'typeName', 
      headerName: 'Type', 
      width: 150,
      editable: true,
      type: 'singleSelect',
      valueOptions: assignmentTypes.map(t => t.typeName),
    },
    { field: 'assignmentName', headerName: 'Title', width: 200, editable: true },
    { field: 'description', headerName: 'Description', width: 300, editable: true },
    { field: 'dueDate', headerName: 'Due Date', width: 150, editable: true },
    { field: 'possiblePoints', headerName: 'Points', width: 100, type: 'number', editable: true },
    { field: 'weight', headerName: 'Weight', width: 100, type: 'number', editable: true },
    {
      field: 'courseName',
      headerName: 'Course',
      width: 180,
      editable: true,
      type: 'singleSelect',
      valueOptions: courses.map(c => c.courseName),
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
            />
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(id)}
          />
        ];
      }
    }
  ];

  const filteredRows = filterCourse 
    ? assignments.filter(row => row.courseName === filterCourse)
    : assignments;

  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.assignmentId}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
          }
        }}
        processRowUpdate={processRowUpdate}
        onProcessRowUpdateError={(error) => console.error("Update error:", error)}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { 
            setFilterCourse,
            assignments,
            courses,
            assignmentTypes,
            setAssignments,
            setRowModesModel,
            selectedCourse: filterCourse
          },
        }}
      />
    </Box>
  );
};

// Styles
const toolbarStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  padding: "12px 16px",
  height: "70px",
  fontSize: "1.1rem",
  backgroundColor: "#f5f5f5",
};

const inputLabelStyles = {
  transform: "translate(14px, -9px) scale(0.75)",
  fontSize: "0.75rem"
};

const containerStyles = {
  maxHeight: 1000,
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' },
};

export default AssignmentDataGrid;