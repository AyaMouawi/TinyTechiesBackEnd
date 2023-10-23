const db = require('../config/db');


const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();


const getAllTrainers = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM users WHERE Role = 'Trainer'`);
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to get new data',
      error,
    });
  }
};


const getTrainerByID = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM users WHERE Role = 'Trainer' AND User_id = ?`, [
      req.params.id,
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


const getTrainersFullName = async (req, res) => {
    try {
      const [result] = await db.query(`SELECT UserFullName FROM users WHERE Role = 'Trainer'`);
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get new data',
        error,
      });
    }
  };


  const getTrainerCourses = async (req, res) => {
    try {
      const [result] = await db.query(`SELECT * FROM courses WHERE Trainer_id = ?` , [
        req.params.id,
      ]);
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get new data',
        error,
      });
    }
  };

  const getTrainerCoursesName = async (req, res) => {
    try {
      const [result] = await db.query(`SELECT CourseName FROM courses WHERE Trainer_id = ?` , [
        req.params.id,
      ]);
      res.status(200).json({
        success: true,
        message: 'Data retrieved successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to get new data',
        error,
      });
    }
  };

 
  const deleteTrainer = async (req, res) => {
    try {
      const [result] = await db.query(`DELETE FROM users WHERE user_id = ?`, [
        req.params.id,
      ]);
      res.status(200).json({
        success: true,
        message: 'Data deleted successfully',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to delete data',
        error,
      });
    }
  };

  const addTrainer = async (req, res) => {
    const { UserFullName, 
            Password, 
            UserEmail, 
            UserAge, 
            UserAbsence, 
            Role } = req.body;
    try {
      const image = await FileUpload(req.file);
      const result = await db.query(
        `INSERT INTO users (UserFullName, Password, UserEmail, UserAge, UserAbsence, Role, TrainerImage) VALUES (?,?,?,?,?,?,?);`,
        [UserFullName, Password, UserEmail, UserAge, UserAbsence, Role,image.downloadURL]
      );
      
      console.log(result);
      res.status(201).json({
        success: true,
        message: 'Data added successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to add new data',
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
    
  

  module.exports = { getAllTrainers, getTrainerByID, getTrainersFullName,  getTrainerCourses, getTrainerCoursesName, deleteTrainer, addTrainer};