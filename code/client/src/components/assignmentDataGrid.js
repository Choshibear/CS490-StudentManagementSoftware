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

// Custom toolbar for AssignmentDataGrid
function EditToolbar({ setFilterCourse, data, setData, setRowModesModel }) {
  const [selectedCourse, setSelectedCourse] = useState("");

  // Get unique course names for dropdown
  const courseNames = [...new Set(data.map((row) => row.courseName))];

  // Function to handle course selection
  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedCourse(value);
    setFilterCourse(value); // Pass selected course to parent
  };

  // Function to handle Add button click
  const handleAddClick = () => {
    const newId = data.length + 1; // Simple ID generation
    //clear form for new row
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
    setData((prevData) => [...prevData, newRow]); // Add new row
    setRowModesModel((prevModes) => ({ // Set new row to edit
      ...prevModes,
      [newId]: { mode: "edit", fieldToFocus: "typeName" },
    }));
  };

  return (
    // Custom toolbar
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

// AssignmentDataGrid component
export default function AssignmentDataGrid() {
  const [data, setData] = useState([]); // State to hold assignment data
  const [filterCourse, setFilterCourse] = useState(""); // State to hold selected course
  const [rowModesModel, setRowModesModel] = useState({}); // State to hold row edit modes

// fetchData function to fetch all assignments from the server
  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await axios.get("http://localhost:5000/api/assignments");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      }
    };
    fetchData();
  }, []);

  // filteredData function to filter data based on selected course
  const filteredData = filterCourse
    ? data.filter((item) => item.courseName === filterCourse)
    : data;

  // Function to handle row edit
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // Function to handle edit click
  const handleEditClick = (assignmentId) => () => {
    setRowModesModel({ ...rowModesModel, [assignmentId]: { mode: GridRowModes.Edit } });
  };

  // Function to handle save click
  const handleSaveClick = (assignmentId) => () => {
    setRowModesModel({ ...rowModesModel, [assignmentId]: { mode: GridRowModes.View } });
  };

// Function to handle delete click
  const handleDeleteClick = (assignmentId) => async () => {
    try {
      await axios.delete(`http://localhost:5000/api/assignments/${assignmentId}`);
      setData((prev) => prev.filter((row) => row.assignmentId !== assignmentId));
    } catch (error) {
      console.error("Failed to delete assignment:", error.response?.data || error.message);
    }
  };

  // Function to handle cancel click
  const handleCancelClick = (assignmentId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [assignmentId]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    // If the row is new, remove it from the data
    const editedRow = data.find((data) => data.assignmentId === assignmentId);
    if (editedRow.isNew) {
      setData(data.filter((data) => data.assignmentId !== assignmentId));
    }
  };

// Function to process row update
  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
  
    try {
      await axios.post('http://localhost:5000/api/assignments', updatedRow);
      setData((prev) =>
        prev.map((row) =>
          row.assignmentId === updatedRow.assignmentId ? updatedRow : row
        )
      );
    } catch (error) {
      console.error("Failed to save assignment:", error.response?.data || error.message);
    }
  
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
        getRowId={(row) => row.assignmentId}
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

