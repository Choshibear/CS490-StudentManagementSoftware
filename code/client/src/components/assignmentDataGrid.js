import React, { useEffect, useState }  from "react";
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
  GridRowEditStopReasons,
} from '@mui/x-data-grid';







   

function EditToolbar({ setFilterCourse, data, setData, setRowModesModel }) {
  const [selectedCourse, setSelectedCourse] = useState("");

  // Get unique course names for dropdown
  const courseNames = [...new Set(data.map((item) => item.courseName))];

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCourse(value);
    setFilterCourse(value); // Pass selected course to parent
  };

  const handleAddClick = () => {
    const newId = data.length + 1; // Simple ID generation
    const newRow = {
      assignmentId: newId,
      typeName: "",
      assignmentName: "",
      description: "",
      dueDate: "",
      possiblePoints: "",
      weight: "",
      courseName: "",
      isNew: true,
    };

    setData((prevData) => [...prevData, newRow]);
    setRowModesModel((prevModes) => ({
      ...prevModes,
      [newId]: { mode: "edit", fieldToFocus: "typeName" },
    }));
  };

  return (
    <GridToolbarContainer sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "12px 16px", // Increase padding
      height: "70px", // Increase height
      fontSize: "1.1rem", // Increase font size
      backgroundColor: "#f5f5f5", // Optional: Light gray background
    }}>
      {/* Course Filter Dropdown */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel shrink sx={{
      transform: "translate(14px, -9px) scale(0.75)", // Adjust position & size
      fontSize: "0.75rem", // Smaller text size
    }}>Filter by Course</InputLabel>
        <Select value={selectedCourse} onChange={handleChange} displayEmpty>
          <MenuItem value="">All Courses</MenuItem>
          {courseNames.map((course) => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Add Assignment Button */}
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

export default function AssignmentDataGrid() {
  const [data, setData] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [rowModesModel, setRowModesModel] = useState({});


  useEffect(() => {
    axios
    .get('http://localhost:5000/api/Assignments/Courses')
    .then((response) => {
      setData(response.data); // Set the data from the API response to state
    })
    .catch((error) => {
      console.error('There was an error fetching the assignments:', error); 
    });
  }, []);


  // Filter data based on selected course
  const filteredData = filterCourse ? data.filter((row) => row.courseName === filterCourse) : data;

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (assignmentId) => () => {
    setRowModesModel({ ...rowModesModel, [assignmentId]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (assignmentId) => () => {
    setRowModesModel({ ...rowModesModel, [assignmentId]: { mode: GridRowModes.View } });
  };


  const handleDeleteClick = (assignmentId) => () => {
    setData(data.filter((data) => data.assignmentId !== assignmentId));
  };

  const handleCancelClick = (assignmentId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [assignmentId]: { mode: GridRowModes.View, ignoreModifications: true },
    });

  
    const editedRow = data.find((data) => data.assignmentId === assignmentId);
    if (editedRow.isNew) {
      setData(data.filter((data) => data.assignmentId !== assignmentId));
    }
  };


  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setData(data.map((data) => (data.assignmentId === newRow.assignmentId ? updatedRow : data)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'assignmentId',
      headerName: 'ID',
      //type: 'string',
      width: 20,
      align: 'left',
      headerAlign: 'left',
      //editable: true,
    },
    { 
      field: 'typeName', 
      headerName: 'Type', 
      width: 120, 
      editable: true,
      //type: 'singleSelect',
      //valueOptions: [data.assignmentTypeId],
    },
    {
      field: 'assignmentName',
      headerName: 'Title',
      type: 'string',
      width: 200,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 350,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'dueDate',
      headerName: 'Due date',
      type: 'string',
      width: 120,
      editable: true,
    },
    {
      field: 'possiblePoints',
      headerName: 'Possible Points',
      type: 'number',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'weight',
      headerName: 'Weight',
      type: 'number',
      width: 75,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'courseName',
      headerName: 'Course',
      width: 120,
      hide: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ assignmentId }) => {
        const isInEditMode = rowModesModel[assignmentId]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(assignmentId)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(assignmentId)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(assignmentId)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(assignmentId)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Box
      sx={{
        maxheight: 1000,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DataGrid
        rows={filteredData}
        columns={columns}
        getRowId={(row) => `${row.assignmentId}-${row.courseId}`}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setFilterCourse, data, setData, setRowModesModel },
        }}
      />
      </div>
    </Box>
  );
}

