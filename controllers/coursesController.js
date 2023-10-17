const db = require('../config/db');
const admin = require('firebase-admin');
const serviceAccount = require('../FireBase/tiny-techies-firebase-adminsdk-bq1zl-8e6f780604.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const storage = admin.storage();


const getAllCourses = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM courses`);
    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error adding new course:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to get new data',
      error: error.message,
    });
  }
};


const getCourseByID = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM courses WHERE Course_id = ?`, [
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


const addCourse = async (req, res) => {
  const {
    Trainer_id,
    CourseName,
    CourseStartTime,
    CourseEndTime,
    CourseDescription,
    CourseFile, // This is the file you want to upload to Firebase Storage
    CourseImage, // This is the image you want to upload to Firebase Storage
    CourseAvailability,
  } = req.body;

  try {
    // Upload CourseFile to Firebase Storage
    const courseFileBucket = storage.bucket(); // Use the default bucket
    const courseFileFileName = `courseFiles/${Date.now()}_${CourseFile.name}`;
    const courseFileFile = courseFileBucket.file(courseFileFileName);

    const courseFileStream = courseFileFile.createWriteStream({
      metadata: {
        contentType: CourseFile.mimetype,
      },
    });

    courseFileStream.on('error', (error) => {
      console.error('Error uploading CourseFile:', error);
    });

    courseFileStream.on('finish', () => {
      // CourseFile uploaded successfully
      console.log('CourseFile uploaded to Firebase Storage.');
    });

    CourseFile.pipe(courseFileStream);

    // Similar code for uploading CourseImage

    const result = await db.query(
      `INSERT INTO courses (Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, CourseFile, CourseImage, CourseAvailability) VALUES (?,?,?,?,?,?,?,?);`,
      [Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, courseFileFileName, CourseImageFileName, CourseAvailability]
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



const deleteCourse = async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM courses WHERE Course_id = ?`, [
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


const updateCourse = async (req, res) => {
  const { Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, CourseFile, CourseImage, CourseAvailability } = req.body;
  const CourseId = req.params.id;
  

  try {
    const result = await db.query(
      `UPDATE users SET Trainer_id = ?, CourseName = ?, CourseStartTime = ?, CourseEndTime = ?, CourseDescription = ?, CourseFile = ?, CourseImage = ?, CourseImage = ?, CourseAvailability = ?  WHERE Course_id = ?`,
      [Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, CourseFile, CourseImage, CourseAvailability, CourseId]
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


module.exports = { getAllCourses, addCourse, getCourseByID, deleteCourse, updateCourse};