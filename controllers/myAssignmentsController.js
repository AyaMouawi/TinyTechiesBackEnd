const db = require('../config/db');
const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
  } = require('firebase/storage');
  
  const storage = getStorage();


  const getAssignmentByCoursesAndStudentID = async (req, res) => {
    try {
      const [result] = await db.query(`
                              SELECT *
                        FROM assignmentscontent
                        WHERE Course_id = ? 
                          AND AssignmentContent_id NOT IN (
                            SELECT AssignmentContent_id
                            FROM studentassignment
                            WHERE Student_id = ?
                          ); 
      `, [
        req.params.cId, 
        req.params.sId, 
      ]);
  
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get data',
        error,
      });
    }
  };


  const getGradesByCourseId = async (req, res) => {
    try {
      const [result] = await db.query(`
      SELECT ac.AssignmentName, sa.Grade
      FROM assignmentscontent ac
      LEFT JOIN studentassignment sa ON ac.AssignmentContent_id = sa.AssignmentContent_id
      WHERE ac.Course_id = ? AND sa.Student_id = ?;
            `, [
              req.params.cId, 
              req.params.sId, 
            ]);
  
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get data',
        error,
      });
    }
  };

  
  const addStudentAssignment = async (req, res) => {
    const {
      AssignmentContent_id,
      Student_id,
      Done,
      Grade,
      
    } = req.body;
  
    try {
      
      

      const file = await FileUpload(req.files.file[0]); 
      console.log(file.downloadURL)
      const result = await db.query(
        `INSERT INTO studentassignment (AssignmentContent_id, Student_id, Done,  StudentAssignmentFile,Grade) VALUES (?,?,?,?,?);`,
        [AssignmentContent_id, Student_id, 1 , file.downloadURL,Grade]
      );
  
      console.log(result);
      res.status(201).json({
        success: true,
        message: 'Data added successfully',
      });
    } catch (error) {
      console.error('Error adding new course:', error);
      res.status(400).json({
        success: false,
        message: 'Unable to add new data',
        error: error.message,
      });
    }
  };
  const updateStudentAssignmentGrade = async (req, res) => {
    const {Grade}  = req.body;
    console.log(Grade);
    const studentId = req.params.Sid;
    const assignmentId = req.params.Aid;
  
    try {
      const result = await db.query(
        `UPDATE studentassignment SET Grade = ? WHERE Student_id = ? AND AssignmentContent_id = ?`,
        [Grade ,studentId, assignmentId ]
        
      );
  
      console.log(result);
      res.status(200).json({
        success: true,
        message: 'Data updated successfully',
      });
      
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to update data',
        error,
      });
    }
  };

  const FileUpload = async (file) => {
    const dateTime = giveCurrentDateTime();
    
      const storageRef = ref(
        storage,
         `files/${file.originalname + '       ' + dateTime}`
      );
    
      // Create file metadata including the content type
      const metadata = {
        contentType: file.mimetype,
      };
    
   
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      );
      
      const downloadURL = await getDownloadURL(snapshot.ref);
    
      console.log('File successfully uploaded.');
      return {
        message: 'file uploaded to firebase storage',
        name: file.originalname,
        type: file.mimetype,
        downloadURL: downloadURL,
      };
    };
    
    const giveCurrentDateTime = () => {
      const today = new Date();
      const date =
        today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const dateTime = date + ' ' + time;
      return dateTime;
    };
    

module.exports = { getAssignmentByCoursesAndStudentID, addStudentAssignment, updateStudentAssignmentGrade, getGradesByCourseId };