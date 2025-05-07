import React, { useEffect, useState } from 'react';
import {
  DataGrid,
  GridActionsCellItem
} from '@mui/x-data-grid';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from '@mui/material';
import {
  Add   as AddIcon,
  DeleteOutlined as DeleteIcon,
  Save  as SaveIcon,
  Close as CancelIcon,
  Edit  as EditIcon
} from '@mui/icons-material';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function AssignmentDataGrid() {
  const [rows, setRows]               = useState([]);
  const [courses, setCourses]         = useState([]);
  const [types, setTypes]             = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [editingId, setEditingId]     = useState(null);
  const [editedRow, setEditedRow]     = useState({});

  // Load assignments, courses, types and apply teacher filtering
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user')) || {};
    (async () => {
      try {
        const [aRes, cRes, tRes] = await Promise.all([
          api.get('/assignments'),
          api.get('/courses'),
          api.get('/assignmenttypes'),
        ]);
        // Filter courses for teacher
        let loadedCourses = cRes.data;
        if (u.role === 'teacher') {
          loadedCourses = loadedCourses.filter(c => c.teacherId === u.teacherId);
        }
        setCourses(loadedCourses);
        setTypes(tRes.data);
        // Filter assignments for teacher
        let assignments = aRes.data;
        if (u.role === 'teacher') {
          const allowedIds = new Set(loadedCourses.map(c => c.courseId));
          assignments = assignments.filter(a => allowedIds.has(a.courseId));
        }
        setRows(assignments);
      } catch (err) {
        console.error('Load failed:', err);
      }
    })();
  }, []);

  const startEdit = row => {
    setEditingId(row.assignmentId);
    setEditedRow({ ...row });
  };
  const cancelEdit = () => {
    if (editedRow.isNew) {
      setRows(r => r.filter(x => x.assignmentId !== editingId));
    }
    setEditingId(null);
    setEditedRow({});
  };
  const saveEdit = async () => {
    const {
      assignmentId,
      isNew,
      assignmentTypeID,
      assignmentName,
      description,
      dueDate,
      possiblePoints,
      weight,
      courseId
    } = editedRow;
    try {
      let res;
      if (isNew) {
        res = await api.post('/assignments', {
          assignmentTypeID,
          assignmentName,
          description,
          dueDate,
          possiblePoints,
          weight,
          courseId
        });
      } else {
        res = await api.put(`/assignments/${assignmentId}`, {
          assignmentTypeID,
          assignmentName,
          description,
          dueDate,
          possiblePoints,
          weight,
          courseId
        });
      }
      setRows(r => r.map(rw =>
        rw.assignmentId === assignmentId ? res.data : rw
      ));
      setEditingId(null);
      setEditedRow({});
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleAdd = () => {
    // 1) pick default course based on filterCourse, or fallback to first
    const defaultCourse = filterCourse
      ? (courses.find(c => c.courseName === filterCourse) || {})
      : (courses[0] || {});
    const defaultType   = types[0] || {};

    const tempId = `new-${Date.now()}`;
    const newRow = {
      assignmentId:     tempId,
      assignmentTypeID: defaultType.typeId,
      assignmentName:   '',
      description:      '',
      dueDate:          '',
      possiblePoints:   0,
      weight:           0,
      courseId:         defaultCourse.courseId,
      isNew:            true
    };
    setRows(r => [...r, newRow]);
    startEdit(newRow);
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/assignments/${id}`);
      setRows(r => r.filter(x => x.assignmentId !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const displayed = filterCourse
    ? rows.filter(r => {
        const c = courses.find(c => c.courseId === r.courseId);
        return c?.courseName === filterCourse;
      })
    : rows;

  const columns = [
    { field: 'assignmentId', headerName: 'ID', width: 80 },
    {
      field: 'assignmentTypeID',
      headerName: 'Type',
      width: 150,
      renderCell: params => {
        const label = types.find(t => t.typeId === params.value)?.typeName || '';
        return params.row.assignmentId === editingId
          ? (
            <Select
              size="small"
              value={editedRow.assignmentTypeID}
              onChange={e => setEditedRow(er => ({ ...er, assignmentTypeID: e.target.value }))}
              fullWidth
            >
              {types.map(t => (
                <MenuItem key={t.typeId} value={t.typeId}>
                  {t.typeName}
                </MenuItem>
              ))}
            </Select>
          )
          : label;
      }
    },
    {
      field: 'assignmentName',
      headerName: 'Title',
      width: 200,
      renderCell: params =>
        params.row.assignmentId === editingId
          ? <TextField
              size="small"
              value={editedRow.assignmentName}
              onChange={e => setEditedRow(er => ({ ...er, assignmentName: e.target.value }))}
              fullWidth
            />
          : params.value
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 300,
      renderCell: params =>
        params.row.assignmentId === editingId
          ? <TextField
              size="small"
              value={editedRow.description}
              onChange={e => setEditedRow(er => ({ ...er, description: e.target.value }))}
              fullWidth
            />
          : params.value
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 150,
      renderCell: params =>
        params.row.assignmentId === editingId
          ? <TextField
              type="date"
              size="small"
              value={editedRow.dueDate}
              onChange={e => setEditedRow(er => ({ ...er, dueDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          : (() => {
              const d = new Date(params.value);
              if (isNaN(d)) return '';
              const mm = String(d.getMonth()+1).padStart(2,'0');
              const dd = String(d.getDate()).padStart(2,'0');
              const yyyy = d.getFullYear();
              return `${mm}/${dd}/${yyyy}`;
            })()
    },
    {
      field: 'possiblePoints',
      headerName: 'Points',
      width: 120,
      renderCell: params =>
        params.row.assignmentId === editingId
          ? <TextField
              type="number"
              size="small"
              value={editedRow.possiblePoints}
              onChange={e => setEditedRow(er => ({ ...er, possiblePoints: +e.target.value }))}
              fullWidth
            />
          : params.value
    },
    {
      field: 'weight',
      headerName: 'Weight',
      width: 120,
      renderCell: params =>
        params.row.assignmentId === editingId
          ? <TextField
              type="number"
              size="small"
              value={editedRow.weight}
              onChange={e => setEditedRow(er => ({ ...er, weight: +e.target.value }))}
              fullWidth
            />
          : params.value
    },
    {
      field: 'courseId',
      headerName: 'Course',
      width: 180,
      renderCell: params => {
        const label = courses.find(c => c.courseId === params.value)?.courseName || '';
        return params.row.assignmentId === editingId
          ? (
            <Select
              size="small"
              value={editedRow.courseId}
              onChange={e => setEditedRow(er => ({ ...er, courseId: e.target.value }))}
              fullWidth
            >
              {courses.map(c => (
                <MenuItem key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </MenuItem>
              ))}
            </Select>
          )
          : label;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      width: 120,
      getActions: ({ id, row }) => {
        if (id === editingId) {
          return [
            <GridActionsCellItem
              key="save"
              icon={<SaveIcon />}
              label="Save"
              onClick={saveEdit}
              color="primary"
            />,
            <GridActionsCellItem
              key="cancel"
              icon={<CancelIcon />}
              label="Cancel"
              onClick={cancelEdit}
              color="inherit"
            />
          ];
        }
        return [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={() => startEdit(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDelete(id)}
            color="inherit"
          />
        ];
      }
    }
  ];

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={toolbarStyles}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel shrink sx={{
            transform: "translate(14px, -9px) scale(0.75)",
            fontSize: "0.75rem",
          }}>
            Filter by Course
          </InputLabel>
          <Select
            value={filterCourse}
            displayEmpty
            onChange={e => setFilterCourse(e.target.value)}
          >
            <MenuItem value=""><em>All Courses</em></MenuItem>
            {courses.map(c => (
              <MenuItem key={c.courseId} value={c.courseName}>
                {c.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={handleAdd}
          sx={{ marginLeft: 'auto' }}
        >
          Add Assignment
        </Button>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, ...containerStyles }}>
        <DataGrid
          rows={displayed}
          columns={columns}
          getRowId={r => r.assignmentId}
          disableSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }} // Default rows per page
           pageSizeOptions={[10, 30, 50, 100]} // Dropdown choices
        />
      </Box>
    </Box>
  );
}

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
const containerStyles = {
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' },
};