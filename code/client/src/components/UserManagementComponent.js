import React, { useState, useEffect, useCallback } from 'react';
import {
  DataGrid, GridActionsCellItem, GridToolbarContainer, 
  GridToolbarFilterButton, GridToolbarExport 
} from '@mui/x-data-grid';
import { 
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, InputLabel, FormControl, 
  Autocomplete, Chip, Alert, Snackbar
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [parentStudentRelationships, setParentStudentRelationships] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [currentUser, setCurrentUser] = useState({
    id: '',
    role: 'student',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    associatedStudents: []
  });

  const requiredFields = {
    admin: ['firstName', 'lastName', 'email', 'username', 'password'],
    teacher: ['firstName', 'lastName', 'email', 'username', 'password'],
    parent: ['firstName', 'lastName', 'email', 'username', 'password'],
    student: ['firstName', 'lastName', 'username', 'password']
  };

  // Enhanced columns with actions
  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'username', headerName: 'Username', width: 180 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 220 },
    { 
      field: 'associatedStudents', 
      headerName: 'Linked Students', 
      width: 280,
      renderCell: (params) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {params.value && Array.isArray(params.value) && params.value.map(studentId => {
            const student = students.find(s => parseInt(s.originalId) === parseInt(studentId));
            return student ? <Chip key={studentId} label={student.label} /> : null;
          })}
        </div>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Edit"
          onClick={() => handleEditClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDeleteUser(params.row)}
        />
      ]
    }
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ gap: 2, p: 2 }}>
      <GridToolbarFilterButton />
      <GridToolbarExport />
  
      <FormControl size="small" sx={{ width: 200 }}>
        <InputLabel>Filter Role</InputLabel>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <MenuItem value="all">All Roles</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="student">Student</MenuItem>
        </Select>
      </FormControl>
  
      <Button 
        variant="contained" 
        onClick={() => {
          setCurrentUser({
            id: '',
            role: 'student',
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            password: '',
            associatedStudents: []
          });
          setEditMode(false);
          setOpenDialog(true);
        }}
      >
        Create New User
      </Button>
    </GridToolbarContainer>
  );
  
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, studentsRes, parentStudentRes] = await Promise.all([
        axios.get('/api/users').catch(err => {
          console.error('Users fetch error:', err.response?.status, err.response?.data);
          throw err;
        }),
        axios.get('/api/students'),
        axios.get('/api/parent_student')
      ]);
      
      const studentData = studentsRes.data.map(s => ({
        label: `${s.firstName} ${s.lastName}`,
        id: `student_${s.id}`, // Composite ID for UI
        originalId: s.id // Original ID for backend
      }));
      
      setStudents(studentData);
      setParentStudentRelationships(parentStudentRes.data);
      
      // Process users and assign associated students
      const processedUsers = usersRes.data.map(user => {
        let associatedStudents = [];
        
        if (user.role === 'parent') {
          // Find all relationships where this parent is involved
          associatedStudents = parentStudentRes.data
            .filter(rel => parseInt(rel.parentId) === parseInt(user.id))
            .map(rel => rel.studentId);
        }
        
        return {
          ...user,
          associatedStudents: associatedStudents || []
        };
      });
      
      setUsers(processedUsers);
    } catch (error) {
      console.error('Fetch data error:', error.response?.data || error.message);
      showSnackbar('Error loading data', 'error');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateUser = async () => {
    try {
      const endpoint = `/api/${currentUser.role}s`;
      const { id, role, associatedStudents, ...userData } = currentUser;
      
      let userId;
      
      if (editMode) {
        // Extract original ID if this is an edit operation
        const originalId = id.includes('_') ? id.split('_')[1] : id;
        await axios.patch(`${endpoint}/${originalId}`, userData);
        userId = originalId;
        showSnackbar('User updated successfully', 'success');
      } else {
        // Create new user
        const response = await axios.post(endpoint, userData);
        userId = response.data.id; // Assuming the API returns the created user ID
        showSnackbar('User created successfully', 'success');
      }
      
      // Handle parent-student relationships if this is a parent
      if (role === 'parent' && userId) {
        // Get current relationships for this parent
        const currentRelationships = parentStudentRelationships
          .filter(rel => rel.parentId === userId)
          .map(rel => rel.studentId);
        
        // Determine students to add and remove
        const studentsToAdd = associatedStudents.filter(
          studentId => !currentRelationships.some(id => parseInt(id) === parseInt(studentId))
        );
        
        const studentsToRemove = currentRelationships.filter(
          studentId => !associatedStudents.some(id => parseInt(id) === parseInt(studentId))
        );
        
        // Create new relationships
        const addPromises = studentsToAdd.map(studentId => 
          axios.post(`/api/parent_student/${userId}/students/${studentId}`)
        );
        
        // Remove old relationships
        const removePromises = studentsToRemove.map(studentId => 
          axios.delete(`/api/parent_student/${userId}/students/${studentId}`)
        );
        
        // Wait for all relationship changes to complete
        await Promise.all([...addPromises, ...removePromises]);
      }
      
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Delete ${user.username} (${user.role})?`)) {
      try {
        const originalId = user.id.includes('_') ? user.id.split('_')[1] : user.id;
        
        // If it's a parent, first remove all parent-student relationships
        if (user.role === 'parent') {
          const parentStudentPromises = user.associatedStudents.map(studentId => 
            axios.delete(`/api/parent_student/${originalId}/students/${studentId}`)
          );
          await Promise.all(parentStudentPromises);
        }
        
        // Then delete the user
        await axios.delete(`/api/${user.role}s/${originalId}`);
        showSnackbar('User deleted successfully', 'success');
        fetchData();
      } catch (error) {
        showSnackbar('Deletion failed', 'error');
      }
    }
  };
  
  const handleEditClick = (user) => {
    setCurrentUser({
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: '', // Password intentionally not shown
      associatedStudents: user.associatedStudents || []
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const validateForm = () => {
    return requiredFields[currentUser.role].every(field => 
      Boolean(currentUser[field]?.trim())
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };
  
  const filteredUsers = users.filter(user => 
    (filterRole === 'all' || user.role === filterRole)
  );

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        slots={{ toolbar: CustomToolbar }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Create New User'}</DialogTitle>
        <DialogContent>
          <form style={{ display: 'grid', gap: 20, padding: '20px 0' }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={currentUser.role}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                disabled={editMode}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            {requiredFields[currentUser.role].map(field => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={currentUser[field]}
                onChange={(e) => setCurrentUser({ ...currentUser, [field]: e.target.value })}
                fullWidth
                required
                type={field === 'password' ? 'password' : 'text'}
              />
            ))}

            {currentUser.role === 'parent' && (
              <Autocomplete
                multiple
                options={students}
                getOptionLabel={(option) => option.label}
                value={students.filter(s => 
                  currentUser.associatedStudents.some(id => parseInt(id) === parseInt(s.originalId))
                )}
                onChange={(_, value) => setCurrentUser({
                  ...currentUser,
                  associatedStudents: value.map(v => v.originalId)
                })}
                renderInput={(params) => (
                  <TextField {...params} label="Associated Students" variant="outlined" />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.label}
                      {...getTagProps({ index })}
                    />
                  ))
                }
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser}
            variant="contained"
            disabled={!validateForm()}
          >
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserManagementComponent;