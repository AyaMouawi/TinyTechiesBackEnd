const db = require('../config/db');

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();

const addAssignmentContent  = async (req, res) => {
    const {
     AssignmentDueDate,
      ZoomLink,
      MeetingDate,
      Course_id,
      AssignmentRequirement,
      AssignmentName,
  
    } = req.body;
  
    try {
      
  
      const file = await FileUpload(req.file); 
      console.log(file.downloadURL)
      const result = await db.query(
        `INSERT INTO assignmentscontent (AssignmentDueDate, AssignmentFile, ZoomLink, MeetingDate, Course_id, AssignmentRequirement, AssignmentName) VALUES (?,?,?,?,?,?,?);`,
        [AssignmentDueDate, file.downloadURL, ZoomLink, MeetingDate, Course_id, AssignmentRequirement, AssignmentName]
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


  const getAssignmentByCourseName = async (req, res) => {
    try {
      const [result] = await db.query(`SELECT a.*
      FROM assignmentscontent AS a
      JOIN courses AS c ON a.Course_id = c.Course_id
      WHERE c.CourseName =?`, [
        req.params.Cname,
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

  // Upload the file in the bucket storage
  const snapshot = await uploadBytesResumable(
    storageRef,
    file.buffer,
    metadata
  );
  //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

  // Grab the public url
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


module.exports = {addAssignmentContent, getAssignmentByCourseName };