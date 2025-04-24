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
    const newId = Math.max(0, ...assignments.map(a => a.assignmentId)) + 1;
    const defaultCourse = selectedCourse || courses[0]?.courseName || "";
    const defaultType = assignmentTypes[0]?.typeName || "";

    const newRow = {
      assignmentId: newId,
      typeName: defaultType,
      assignmentName: "",
      description: "",
      dueDate: "",
      possiblePoints: 100,
      weight: 0.1,
      courseName: defaultCourse,
      isNew: true,
    };
    
    
    setAssignments(prev => [...prev, newRow]);
    setRowModesModel(prev => ({
      ...prev,
      [newId]: { mode: GridRowModes.Edit, fieldToFocus: "assignmentName" },
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
            
        
        const formatDate = (isoDate) => {
          const date = new Date(isoDate);
          const mm = String(date.getMonth() + 1).padStart(2, '0');
          const dd = String(date.getDate()).padStart(2, '0');
          const yyyy = date.getFullYear();
          return `${mm}-${dd}-${yyyy}`;
        };
        
        const mergedData = assignmentsRes.data.map(assignment => {
          const course = coursesRes.data.find(c => c.courseId === assignment.courseId);
          const type = typesRes.data.find(t => t.typeId === assignment.assignmentTypeID);
          return {
            ...assignment,
            courseName: course?.courseName || "",
            typeName: type?.typeName || "",
            dueDate: formatDate(assignment.dueDate)
          };
        });

        setCourses(coursesRes.data);
        setAssignmentTypes(typesRes.data);
        setAssignments(mergedData);
      } catch (error) {
        console.error("Data fetch failed:", error);
      }
    };
    fetchData();
  }, []);


  const processRowUpdate = async (newRow) => {
    try {
    const course = courses.find(c => c.courseName === newRow.courseName);
    const type = assignmentTypes.find(t => t.typeName === newRow.typeName);

    if (!course || !type) throw new Error("Invalid course or type");

    const payload = {
      assignmentId: newRow.assignmentId,
      assignmentTypeID: type.typeId,
      assignmentName: newRow.assignmentName,
      description: newRow.description,
      dueDate: newRow.dueDate,
      possiblePoints: newRow.possiblePoints,
      weight: newRow.weight,
      courseId: course.courseId
    };

    let response;
      if (newRow.isNew) {
        response = await axios.post("http://localhost:5000/api/assignments", payload);
      } else {
        response = await axios.put(`http://localhost:5000/api/assignments/${newRow.assignmentId}`, payload);
      }

      const savedAssignment = response.data;

    const updatedRow = {
      ...savedAssignment,
      courseName: course.courseName,
      typeName: type.typeName,
      isNew: false
    };

    setAssignments((prev) => prev.map((row) => row.assignmentId === updatedRow.assignmentId ? updatedRow : row));
      return updatedRow;
    } catch (error) {
      console.error("Update failed:", error);
      throw error;
    }
  };

  const handleRowModesModelChange = (newModel) => {
    setRowModesModel(newModel);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const target = assignments.find((row) => row.assignmentId === id);
      if (!target) return;
  
      if (target.isNew) {
        // If it's a new unsaved row, just remove from state
        setAssignments((prev) => prev.filter((row) => row.assignmentId !== id));
        return;
      }
  
      // Delete from server
      await axios.delete('http://localhost:5000/api/assignments/${id}');
      
      // Remove from state
      setAssignments((prev) => prev.filter((row) => row.assignmentId !== id));
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
      getActions: ({ id }) => [
        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => { setRowModesModel((prev) => ({ ...prev, [id]: { mode: GridRowModes.View } } )); }} showInMenu/>,
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(id)} color="inherit" />
      ]
    }
  ];

  const filteredRows = filterCourse ? assignments.filter(row => row.courseName === filterCourse) : assignments;


  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        getRowId={(row) => row.assignmentId}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        processRowUpdate={processRowUpdate}
        experimentalFeatures={{ newEditingApi: true }}
        onRowEditStop={(params, event) => {
          if (params.reason === GridRowEditStopReasons.rowFocusOut ||
              params.reason === GridRowEditStopReasons.enterKeyDown) {
            // Allow save on Enter or blur
            event.defaultMuiPrevented = false;
          }
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 30,
              page: 0,
            },
          },
        }} // Default rows per page
        pageSizeOptions={[10, 30, 50, 100]} // Dropdown choices
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
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' },
};

export default AssignmentDataGrid;