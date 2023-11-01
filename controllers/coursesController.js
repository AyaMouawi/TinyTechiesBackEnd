const db = require('../config/db');

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();


const getAllCourses = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
            c.Course_id,
            c.CourseName,
            c.CourseStartTime,
            c.CourseEndTime,
            c.CourseDescription,
            c.CourseFile,
            c.CourseImage,
            u.UserFullName AS TrainerName,
            COUNT(sc.Student_id) AS StudentCount
        FROM
            courses c
        LEFT JOIN
            studentcourses sc
            ON c.Course_id = sc.Course_id
        LEFT JOIN
            users u
            ON c.Trainer_id = u.User_id
        WHERE
            c.CourseEndTime > NOW()  
        GROUP BY
            c.Course_id, c.CourseName, c.CourseStartTime, c.CourseEndTime, c.CourseDescription, c.CourseFile, c.CourseImage, TrainerName`);
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

const getAllAdminCourses = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
            c.Course_id,
            c.CourseName,
            c.CourseStartTime,
            c.CourseEndTime,
            c.CourseDescription,
            c.CourseFile,
            c.CourseImage,
            u.UserFullName AS TrainerName,
            COUNT(sc.Student_id) AS StudentCount
        FROM
            courses c
        LEFT JOIN
            studentcourses sc
            ON c.Course_id = sc.Course_id
        LEFT JOIN
            users u
            ON c.Trainer_id = u.User_id
        GROUP BY
            c.Course_id, c.CourseName, c.CourseStartTime, c.CourseEndTime, c.CourseDescription, c.CourseFile, c.CourseImage, TrainerName`);
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

const getPopularCourses = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT c.*, COUNT(sc.Student_id) AS StudentCount
                                      FROM courses c
                                      LEFT JOIN studentcourses sc ON c.Course_id = sc.Course_id
                                      WHERE c.CourseEndTime > NOW()  
                                      GROUP BY c.Course_id, c.CourseName, c.Trainer_id, c.CourseStartTime, c.CourseEndTime, c.CourseDescription, c.CourseFile, c.CourseImage
                                      ORDER BY StudentCount DESC
                                      LIMIT 4`);
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

const getCoursesByStudentId = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT c.*, (
        SELECT COUNT(Student_id)
        FROM studentcourses sc
        WHERE sc.Course_id = c.Course_id
      ) AS StudentCount
      FROM courses c
      WHERE c.Course_id NOT IN (
        SELECT Course_id
        FROM studentcourses
        WHERE Student_id = ?
      )
      AND c.CourseEndTime > NOW()
    `, [req.params.id]);

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




const getCourseByID = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
                                      c.CourseName AS 'Course Name',
                                      c.CourseDescription AS 'Course Description',
                                      c.CourseFile AS 'Course File',
                                      CONCAT(u.UserFullName) AS 'Tutor Name',
                                      c.CourseStartTime AS 'Start Date',
                                      c.CourseEndTime AS 'End Date',
                                      COUNT(sc.Student_id) AS 'StudentsCount'
                                  FROM courses c
                                  LEFT JOIN users u ON c.Trainer_id = u.User_id
                                  LEFT JOIN studentcourses sc ON c.Course_id = sc.Course_id
                                  WHERE
                                      c.Course_id = ? AND
                                      c.CourseEndTime > NOW()`, [
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

const getCourseByCourseName = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
                                      c.Course_id,
                                      c.CourseName,
                                      c.CourseStartTime,
                                      c.CourseEndTime,
                                      c.CourseDescription,
                                      c.CourseFile,
                                      c.CourseImage,
                                      COUNT(sc.Student_id) AS StudentCount
                                  FROM
                                      courses c
                                  LEFT JOIN
                                      studentcourses sc
                                  ON
                                      c.Course_id = sc.Course_id
                                  WHERE
                                      c.CourseName = ? AND
                                      c.CourseEndTime > NOW()`, [
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

const getStudentCourse = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
      c.*,
      (SELECT COUNT(*) FROM studentcourses sc WHERE sc.Course_id = c.Course_id) AS StudentCount
    FROM
      courses c
    WHERE
      c.Course_id IN (
        SELECT Course_id FROM studentcourses WHERE Student_id = ?
      )
      AND c.CourseEndTime > NOW()`, [
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


const getCoursesByTrainerID = async (req, res) => {
  try {
    const [result] = await db.query(`
    SELECT c.*, COUNT(sc.Student_id) AS StudentCount
    FROM courses c
    LEFT JOIN studentcourses sc ON c.Course_id = sc.Course_id
    WHERE c.Trainer_id = ? AND c.CourseEndTime > NOW()  
    GROUP BY c.Course_id, c.Trainer_id, c.CourseName, c.CourseStartTime, c.CourseEndTime, c.CourseDescription, c.CourseFile, c.CourseImage
    `, [req.params.id]);

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
   
  } = req.body;

  try {
    
    
    const image = await FileUpload(req.files.image[0]);
    const file = await FileUpload(req.files.file[0]); 
    console.log(image.downloadURL)
    console.log(file.downloadURL)
    const result = await db.query(
      `INSERT INTO courses (Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, CourseFile, CourseImage) VALUES (?,?,?,?,?,?,?);`,
      [Trainer_id, CourseName, CourseStartTime, CourseEndTime, CourseDescription, image.downloadURL, file.downloadURL]
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
  const {
    Trainer_id,
    CourseName,
    CourseStartTime,
    CourseEndTime,
    CourseDescription,
  } = req.body;

  const { Course_id } = req.params; 

  try {
    const image = await FileUpload(req.files.image[0]);
    const file = await FileUpload(req.files.file[0]);
    console.log(image.downloadURL);
    console.log(file.downloadURL);
    const result = await db.query(
      `UPDATE courses 
       SET Trainer_id = ?, 
           CourseName = ?, 
           CourseStartTime = ?, 
           CourseEndTime = ?, 
           CourseDescription = ?, 
           CourseFile = ?, 
           CourseImage = ? 
       WHERE Course_id = ?`,
      [
        Trainer_id,
        CourseName,
        CourseStartTime,
        CourseEndTime,
        CourseDescription,
        file.downloadURL,
        image.downloadURL,
        Course_id, 
      ]
    );

    console.log(result);
    res.status(200).json({
      success: true,
      message: 'Data updated successfully',
    });
  } catch (error) {
    console.error(error); 
    res.status(400).json({
      success: false,
      message: 'Unable to update data',
      error: error.message,
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


module.exports = { getAllCourses, addCourse, getCourseByID, deleteCourse, updateCourse, getPopularCourses, getStudentCourse, getCoursesByTrainerID, getCourseByCourseName, getCoursesByStudentId, getAllAdminCourses};