// UserManagement.js
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Button, Dialog, TextField, Select, MenuItem, 
  InputLabel, FormControl, Chip, Autocomplete 
} from '@mui/material';
import axios from 'axios';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [newUser, setNewUser] = useState({
    role: 'student',
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    associatedStudents: []
  });

  const columns = [
    { field: 'username', headerName: 'Username', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'firstName', headerName: 'First Name', width: 150 },
    { field: 'lastName', headerName: 'Last Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { 
      field: 'associatedStudents', 
      headerName: 'Linked Students', 
      width: 300,
      renderCell: (params) => (
        <div>
          {params.value.map(student => (
            <Chip key={student} label={student} sx={{ m: 0.5 }} />
          ))}
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, studentsRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/students')
      ]);
      setUsers(usersRes.data);
      setStudents(studentsRes.data.map(s => ({ label: `${s.firstName} ${s.lastName}`, id: s.studentId })));
    };
    fetchData();
  }, []);

  const createUser = async () => {
    try {
      await axios.post('/api/users', newUser);
      setOpen(false);
      setNewUser({ ...newUser, password: '' });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = Object.values(user).some(value =>
      String(value).toLowerCase().includes(search.toLowerCase())
    );
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ height: 800, padding: 20 }}>
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <TextField
          label="Search Users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
        <FormControl sx={{ width: 200 }}>
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
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create New User
        </Button>
      </div>

      <DataGrid
        rows={filteredUsers}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <div style={{ padding: 20 }}>
          <h2>Create New User</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="parent">Parent</MenuItem>
                <MenuItem value="student">Student</MenuItem>
              </Select>
            </FormControl>

            {['firstName', 'lastName', 'email', 'username', 'password'].map(field => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={newUser[field]}
                onChange={(e) => setNewUser({...newUser, [field]: e.target.value})}
                fullWidth
                type={field === 'password' ? 'password' : 'text'}
              />
            ))}

            {(newUser.role === 'parent' || newUser.role === 'teacher') && (
              <Autocomplete
                multiple
                options={students}
                getOptionLabel={(option) => option.label}
                onChange={(_, value) => setNewUser({
                  ...newUser,
                  associatedStudents: value.map(v => v.id)
                })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Linked ${newUser.role === 'parent' ? 'Children' : 'Students'}`}
                  />
                )}
              />
            )}
          </div>
          <Button 
            variant="contained" 
            onClick={createUser}
            sx={{ mt: 2 }}
          >
            Create User
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default UserManagementComponent;