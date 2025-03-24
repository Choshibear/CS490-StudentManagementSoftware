import React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';


const types = ['Homework', 'Project', 'Quiz', 'Presentation', 'Test'];


const initialRows = [
  {
    id: 1,
    type: 'Homework',
    title: ' HW-1',
    description: 'This will be a description of the assignment',
    dueDate: '1/27/2025',
    possiblePoints: 20,
    viewScores: 'NaN',
  },
  {
    id: 2,
    type: 'Project',
    title: 'Capstone-2',
    description: 'This will be a description of the assignment',
    dueDate: '7/19/2025',
    possiblePoints: 100,
    viewScores: 'NaN',
  },
  {
    id: 3,
    type: 'Quiz',
    title: 'Quiz#3',
    description: 'This will be a description of the assignment',
    dueDate: '4/12/2025',
    possiblePoints: 10,
    viewScores: 'NaN',
  },
  {
    id: 4,
    type: 'Presentation',
    title: 'PowerPoint-4',
    description: 'This will be a description of the assignment',
    dueDate: '3/21/2025',
    possiblePoints: 100,
    viewScores: 'NaN',
  },
  {
    id: 5,
    type: 'Test',
    title: 'Chapter-1',
    description: 'This will be a description of the assignment',
    dueDate: '5/8/2025',
    possiblePoints: 50,
    viewScores: 'NaN',
  },
];

   

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = 6;
    setRows((oldRows) => [
      ...oldRows,
      { id, type: '', title: '', description: '', possiblePoints: '', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'type' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Assignment
      </Button>
    </GridToolbarContainer>
  );
}

 export default function AssignmentDataGrid() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 120, 
      editable: true,
      type: 'singleSelect',
      valueOptions: ['Homework', 'Project', 'Quiz', 'Presentation'],
    },
    {
      field: 'title',
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
      width: 450,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'dueDate',
      headerName: 'Due date',
      type: 'string',
      width: 160,
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
      field: 'viewScores',
      headerName: 'View Scores',
      type: 'number',
      width: 120,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
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
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
      </div>
    </Box>
  );
}



//export default Coursework;
