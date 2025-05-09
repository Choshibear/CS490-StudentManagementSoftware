import React, { useState, useEffect, useCallback } from 'react';
import {
  DataGrid, GridActionsCellItem, GridToolbarContainer,
  GridToolbarExport, GridToolbarFilterButton
} from '@mui/x-data-grid';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Select, MenuItem, InputLabel, FormControl,
  Autocomplete, Chip, Alert, Snackbar
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const CourseManagementComponent = () => {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentCourse, setCurrentCourse] = useState({
    id: '',
    courseName: '',
    teacherId: '',
    enrolledStudentIds: []
  });

  const requiredFields = ['courseName', 'teacherId'];

  const columns = [
    { field: 'courseId', headerName: 'Course ID', width: 150 }, // Changed from 'id'
    { field: 'courseName', headerName: 'Course Name', width: 200 },
    {
        field: 'teacherId',
        headerName: 'Assigned Teacher',
        width: 250,
        renderCell: (params) => {
          const teacher = teachers.find(t => t.teacherId === params.value);
          return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unassigned';
        }
      },
    { 
      field: 'enrolledStudentIds',
      headerName: 'Enrolled Students',
      width: 400,
      renderCell: (params) => {
        if (loading) return 'Loading...';
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {params.row.enrolledStudentIds.map(studentId => {
              const student = students.find(s => s.id === studentId);
              return student ? <Chip key={studentId} label={student.label} /> : null;
            })}
          </div>
        );
      }
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
          onClick={() => handleDeleteCourse(params.row)}
        />
      ]
    }
  ];

  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ gap: 2, p: 2 }}>
      <GridToolbarFilterButton />
      <GridToolbarExport />
      <Button
        variant="contained"
        onClick={() => {
          setCurrentCourse({
            id: '',
            courseName: '',
            teacherId: '',
            enrolledStudentIds: []
          });
          setEditMode(false);
          setOpenDialog(true);
        }}
      >
        Create New Course
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
      setLoading(true);
      const [coursesRes, teachersRes, studentsRes, enrollmentsRes] = await Promise.all([
        axios.get('/api/courses'),
        axios.get('/api/teachers'),
        axios.get('/api/students'),
        axios.get('/api/enrollments')
      ]);
  
      // Process students data to match expected format
      const processedStudents = studentsRes.data.map(s => ({
        label: `${s.firstName} ${s.lastName}`,
        id: s.studentId  // Changed from s.id to s.studentId to match database
      }));
  
      // Process teachers data
      const teacherMap = new Map();
      teachersRes.data.forEach(teacher => {
        teacherMap.set(teacher.teacherId, `${teacher.firstName} ${teacher.lastName}`);
      });
  
      // Process enrollments
      const enrollmentMap = new Map();
      enrollmentsRes.data.forEach(enrollment => {
        if (!enrollmentMap.has(enrollment.courseId)) {
          enrollmentMap.set(enrollment.courseId, []);
        }
        enrollmentMap.get(enrollment.courseId).push(enrollment.studentId);
      });
  
      // Process courses
      const processedCourses = coursesRes.data.map(course => {
        const teacherName = teacherMap.get(course.teacherId) || 'Unassigned';
        const enrolledStudents = enrollmentMap.get(course.courseId) || [];
        
        return {
          ...course,
          id: course.courseId,
          teacherName,
          teacherId: course.teacherId || '',
          enrolledStudentIds: enrolledStudents
        };
      });
  
      setTeachers(teachersRes.data);
      setStudents(processedStudents);
      setEnrollments(enrollmentsRes.data);
      setCourses(processedCourses);
    } catch (error) {
      console.error('Fetch data error:', error);
      showSnackbar('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateOrUpdateCourse = async () => {
    try {
      const { id, enrolledStudentIds, ...courseData } = currentCourse;
      let courseId = id;

      if (editMode) {
        await axios.put(`/api/courses/${id}`, courseData);
        showSnackbar('Course updated successfully', 'success');
      } else {
        const response = await axios.post('/api/courses', courseData);
        courseId = response.data.id;
        showSnackbar('Course created successfully', 'success');
      }

      // Handle enrollments
      const currentEnrollments = enrollments.filter(e => e.courseId === courseId);
      const currentStudentIds = currentEnrollments.map(e => e.studentId);

      const studentsToAdd = enrolledStudentIds.filter(
        studentId => !currentStudentIds.includes(studentId)
      );
      
      const studentsToRemove = currentStudentIds.filter(
        studentId => !enrolledStudentIds.includes(studentId)
      );

      // Create new enrollments
      const addPromises = studentsToAdd.map(studentId => 
        axios.post('/api/enrollments', {
          studentId,
          courseId,
          enrollmentDate: new Date().toISOString()
        })
      );

      // Remove old enrollments
      const removePromises = studentsToRemove.map(studentId => {
        const enrollment = currentEnrollments.find(e => e.studentId === studentId);
        return axios.delete(`/api/enrollments/${enrollment.enrollmentId}`);
      });

      await Promise.all([...addPromises, ...removePromises]);
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteCourse = async (course) => {
    if (window.confirm(`Delete ${course.courseName}?`)) {
      try {
        // First delete associated enrollments
        const enrollmentsToDelete = enrollments.filter(e => e.courseId === course.id);
        const deletePromises = enrollmentsToDelete.map(e => 
          axios.delete(`/api/enrollments/${e.enrollmentId}`)
        );
        
        // Wait for all enrollments to be deleted first
        await Promise.all(deletePromises);
        
        // Then delete the course
        await axios.delete(`/api/courses/${course.id}`);
        
        showSnackbar('Course deleted successfully', 'success');
        fetchData();
      } catch (error) {
        console.error('Deletion error:', error);
        showSnackbar(error.response?.data?.message || 'Deletion failed', 'error');
      }
    }
  };

  const handleEditClick = (course) => {
    setCurrentCourse({
      id: course.id,
      courseName: course.courseName,
      teacherId: course.teacherId,
      enrolledStudentIds: course.enrolledStudentIds
    });
    setEditMode(true);
    setOpenDialog(true);
  };

  const validateForm = () => {
    return requiredFields.every(field => {
        const value = currentCourse[field];
        return typeof value === 'string' ? value.trim() !== '' : value !== undefined && value !== null;
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div style={{ height: '700px', width: '100%' }}>
      <DataGrid
        rows={courses}
        columns={columns}
        getRowHeight={() => 'auto'}
        slots={{ toolbar: CustomToolbar }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 25, 50]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Course' : 'Create New Course'}</DialogTitle>
        <DialogContent>
          <form style={{ display: 'grid', gap: 20, padding: '20px 0' }}>
            <TextField
              label="Course Name"
              value={currentCourse.courseName}
              onChange={(e) => setCurrentCourse({ ...currentCourse, courseName: e.target.value })}
              fullWidth
              required
            />

            <FormControl fullWidth>
              <InputLabel>Assigned Teacher</InputLabel>
              <Select
                value={currentCourse.teacherId}
                onChange={(e) => setCurrentCourse({ ...currentCourse, teacherId: e.target.value })}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {teachers.map(teacher => (
                  <MenuItem key={teacher.teacherId} value={teacher.teacherId}>
                    {teacher.firstName} {teacher.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              multiple
              options={students}
              getOptionLabel={(option) => option.label}
              value={students.filter(s => currentCourse.enrolledStudentIds.includes(s.id))}
              onChange={(_, value) => setCurrentCourse({
                ...currentCourse,
                enrolledStudentIds: value.map(v => v.id)
              })}
              renderInput={(params) => (
                <TextField {...params} label="Enrolled Students" variant="outlined" />
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrUpdateCourse}
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

export default CourseManagementComponent;