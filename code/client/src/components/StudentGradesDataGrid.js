import React, { useEffect, useState } from "react";
 import {
   DataGrid,
   GridToolbarContainer
 } from "@mui/x-data-grid";
 import {
   FormControl,
   InputLabel,
   Select,
   MenuItem
} from "@mui/material";
 import Box from '@mui/material/Box';
 import axios from "axios";
 
 const EditToolbar = ({ courses, selectedCourseId, setSelectedCourseId }) => {
   return (
     <GridToolbarContainer sx={toolbarStyles}>
       <FormControl size="small" sx={{ minWidth: 200 }}>
         <InputLabel>Filter by Course</InputLabel>
         <Select
           value={selectedCourseId ?? ''}
           label="Filter by Course"
           onChange={(e) => setSelectedCourseId(Number(e.target.value))}
           //displayEmpty
         >
           <MenuItem value="">
           <em>All Courses</em>
           </MenuItem>
           {courses.map((course) => (
             <MenuItem key={course.courseId} value={course.courseId}>
               {course.courseName}
             </MenuItem>
           ))}
         </Select>
       </FormControl>
     </GridToolbarContainer>
   );
 };
 
 const StudentGradesDataGrid = () => {
   const [gradesData, setGradesData] = useState([]);
   const [courses, setCourses] = useState([]);
   const [selectedCourseId, setSelectedCourseId] = useState(''); // Default courseId = 1
 
   useEffect(() => {
     const fetchCourses = async () => {
       const res = await axios.get("http://localhost:5000/api/courses");
       setCourses(res.data);
       if (res.data.length > 0 && !selectedCourseId) {
         setSelectedCourseId(res.data[0].courseId); // default to first available
       }
     };
     fetchCourses();
   }, []);
 
   useEffect(() => {
     if (!selectedCourseId) return;
     const fetchGradebook = async () => {
      const res = await axios.get(`http://localhost:5000/api/assignmentgrades/course/${selectedCourseId}`);
       const grouped = groupData(res.data);
       setGradesData(grouped);
     };
     fetchGradebook();
   }, [selectedCourseId]);
 
   const groupData = (rows) => {
     const studentMap = {};
     const assignmentSet = new Set();
 
     rows.forEach((row) => {
       if (!studentMap[row.student_id]) {
         studentMap[row.student_id] = {
           id: row.student_id,
           student: row.student_name,
         };
       }
       studentMap[row.student_id][row.assignmentName] = row.assignmentPoints || '';
       assignmentSet.add(row.assignmentName);
     });
 
     return Object.values(studentMap);
   };
 
   const getColumns = () => {
     const assignmentNames = gradesData.length > 0
       ? Object.keys(gradesData[0]).filter((k) => k !== 'id' && k !== 'student')
       : [];
 
     const assignmentColumns = assignmentNames.map((name) => ({
       field: name,
       headerName: name,
       width: 150,
       editable: true,
     }));
 
     return [
       { field: 'student', headerName: 'Student', width: 200 },
       ...assignmentColumns
     ];
   };
 
   const handleRowUpdate = async (newRow, oldRow) => {
     const studentId = newRow.id;
   
     // Find the changed assignment
     const changedAssignment = Object.keys(newRow).find(
       (key) => newRow[key] !== oldRow[key] && key !== 'id' && key !== 'student'
     );
   
     if (!changedAssignment) return oldRow;
   
     const updatedPoints = newRow[changedAssignment];
 
     console.log('Detected edit:');
   console.log('Student ID:', studentId);
   console.log('Assignment:', changedAssignment);
   console.log('Updated Points:', updatedPoints);
   
     try {
       const response = await axios.put('http://localhost:5000/api/assignmentgrades/update', {
         studentId,
         courseId: selectedCourseId,
         assignmentName: changedAssignment,
         points: updatedPoints
       });
 
       console.log('API response:', response.data); // Log the API response
 
       // Update local state to reflect UI
     setGradesData((prevRows) =>
       prevRows.map((row) =>
         row.id === newRow.id
           ? { ...row, [changedAssignment]: updatedPoints }
           : row
       )
     );
 
     console.log('Local state updated.');
   
       return { ...newRow}; // confirms successful update to DataGrid
     } catch (error) {
       console.error("Error updating grade:", error);
       return oldRow; // revert to old row if error occurs
     }
   };
 
   return (
     <Box>
    <GridToolbarContainer sx={toolbarStyles}>
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Filter by Course</InputLabel>
      <Select
        value={selectedCourseId ?? ''}
        label="Filter by Course"
        onChange={(e) => setSelectedCourseId(Number(e.target.value))}
        //displayEmpty
      >
        <MenuItem value="">
        <em>All Courses</em>
        </MenuItem>
        {courses.map((course) => (
          <MenuItem key={course.courseId} value={course.courseId}>
            {course.courseName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </GridToolbarContainer>
     
     <Box sx={containerStyles}>
       <DataGrid
         rows={gradesData}
         columns={getColumns()}
         processRowUpdate={handleRowUpdate}
         onProcessRowUpdateError={(err) => console.error(err)}
         experimentalFeatures={{ newEditingApi: true }}
         initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
              page: 0,
            },
          },
        }} // Default rows per page
         pageSizeOptions={[10, 30, 50, 100]} // Dropdown choices
         slots={{
           toolbar: EditToolbar
         }}
         slotProps={{
           toolbar: {
             courses,
             selectedCourseId,
             setSelectedCourseId
           }
         }}
         disableColumnMenu
       />
       </Box>
       </Box>
   );
};
 
//Styles
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
 
 export default StudentGradesDataGrid;