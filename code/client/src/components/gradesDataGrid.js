import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer
} from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography
} from "@mui/material";
import axios from "axios";

const EditToolbar = ({ 
  courses, 
  students, 
  selectedCourseId, 
  selectedStudentId, 
  setSelectedCourseId, 
  setSelectedStudentId 
}) => {
  return (
    <GridToolbarContainer sx={{
      display: "flex",
      alignItems: "center",
      gap: 2,
      padding: "12px 16px",
      height: "70px",
      fontSize: "1.1rem",
      backgroundColor: "#f5f5f5",
    }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel shrink>Course</InputLabel>
        <Select
          value={selectedCourseId ?? ''}
          onChange={(e) => {
            setSelectedCourseId(Number(e.target.value));
            setSelectedStudentId(null); // Reset student when course changes
          }}
          displayEmpty
        >
          <MenuItem value="">
            <em>Select a course</em>
          </MenuItem>
          {courses.map((course) => (
            <MenuItem key={course.courseId} value={course.courseId}>
              {course.courseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedCourseId && (
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel shrink>Student</InputLabel>
          <Select
            value={selectedStudentId ?? ''}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            displayEmpty
            disabled={!selectedCourseId}
          >
            <MenuItem value="">
              <em>Select a student</em>
            </MenuItem>
            {students.map((student) => (
              <MenuItem key={student.studentId} value={student.studentId}>
                {student.studentName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </GridToolbarContainer>
  );
};

const Gradebook = () => {
  const [gradesData, setGradesData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await axios.get('http://localhost:5000/api/courses');
      setCourses(res.data);
    };
    fetchCourses();
  }, []);

  // Fetch students when course is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedCourseId) {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/courses/${selectedCourseId}/students`);
          setStudents(res.data);
        } catch (error) {
          console.error("Error fetching students:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStudents();
  }, [selectedCourseId]);

  // Fetch grade when both course and student are selected
  useEffect(() => {
    const fetchGrade = async () => {
      if (selectedCourseId && selectedStudentId) {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:5000/api/coursegrades?courseId=${selectedCourseId}&studentId=${selectedStudentId}`
          );
          // Transform the grade data for display
          setGradesData([transformGradeData(res.data)]);
        } catch (error) {
          console.error("Error fetching grade:", error);
          setGradesData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setGradesData([]);
      }
    };
    fetchGrade();
  }, [selectedCourseId, selectedStudentId]);

  // Transform the grade object into a format suitable for the DataGrid
  const transformGradeData = (grade) => {
    return {
      id: grade.courseGradeId,
      date: new Date(grade.date).toLocaleDateString(),
      studentId: grade.studentId,
      courseId: grade.courseId,
      grade: grade.courseGrade,
      feedback: grade.feedback,
      average: grade.courseAvg
    };
  };

  const getColumns = () => {
    return [
      { field: 'id', headerName: 'Grade ID', width: 100 },
      { field: 'date', headerName: 'Date', width: 150 },
      { field: 'studentId', headerName: 'Student ID', width: 120 },
      { field: 'courseId', headerName: 'Course ID', width: 120 },
      { 
        field: 'grade', 
        headerName: 'Grade', 
        width: 120, 
        editable: true,
        type: 'singleSelect',
        valueOptions: ['A', 'B', 'C', 'D', 'F', 'I', 'W']
      },
      { field: 'feedback', headerName: 'Feedback', width: 300, editable: true },
      { field: 'average', headerName: 'Average', width: 120 }
    ];
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      // Prepare the updated data in the format your API expects
      const updatedData = {
        courseGradeId: newRow.id,
        date: new Date(newRow.date).toISOString(),
        studentId: newRow.studentId,
        courseId: newRow.courseId,
        courseGrade: newRow.grade,
        feedback: newRow.feedback,
        courseAvg: newRow.average
      };

      // Send the update to your API
      await axios.put(`http://localhost:5000/api/coursegrades/${newRow.id}`, updatedData);

      // Update local state
      setGradesData([newRow]);

      return newRow;
    } catch (error) {
      console.error("Error updating grade:", error);
      return oldRow;
    }
  };

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={gradesData}
        columns={getColumns()}
        loading={loading}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        experimentalFeatures={{ newEditingApi: true }}
        slots={{
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: {
            courses,
            students,
            selectedCourseId,
            selectedStudentId,
            setSelectedCourseId,
            setSelectedStudentId
          }
        }}
        disableColumnMenu
        sx={{
          '& .MuiDataGrid-cell': {
            padding: '8px 16px',
          },
        }}
      />
      {gradesData.length === 0 && selectedCourseId && selectedStudentId && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 100,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderTop: 0
        }}>
          <Typography variant="body1">
            No grade record found for this student in the selected course.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Gradebook;