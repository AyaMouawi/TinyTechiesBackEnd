const db = require('../config/db');

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();


const getAllProjects = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
                                        projects.Project_id,
                                        projects.Student_id,
                                        projects.Course_id,
                                        projects.ProjectName,
                                        projects.ProjectDescription,
                                        projects.ProjectFile,
                                        projects.ShowProject,
                                        projects.StudentImage,
                                        projects.StudentProject,
                                        users.UserFullName AS UserName
                                    FROM
                                        projects
                                    LEFT JOIN
                                        users ON projects.Student_id = users.User_id`);
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

const getStudentProjects = async (req, res) => {
  try {
    const studentId = req.params.sId; 
    const courseId = req.params.cId;     

    const [result] = await db.query(
      `SELECT
      projects.*,
      users.UserFullName AS UserName
    FROM
      projects
    LEFT JOIN
      users ON projects.Student_id = users.User_id
    WHERE
      projects.Student_id = ? AND projects.Course_id = ?`,
      [studentId, courseId]
    );

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error retrieving student projects:', error);
    res.status(400).json({
      success: false,
      message: 'Unable to retrieve data',
      error: error.message,
    });
  }
};


const getRemarkableProjects = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT
                                        projects.Project_id,
                                        projects.Student_id,
                                        projects.StudentImage,
                                        projects.Course_id,
                                        projects.ProjectName,
                                        projects.ProjectDescription,
                                        projects.ProjectFile,
                                        projects.ShowProject,
                                        projects.StudentProject,
                                        users.UserFullName AS UserName
                                    FROM
                                        projects
                                    LEFT JOIN
                                        users ON projects.Student_id = users.User_id
                                    WHERE
                                        projects.ShowProject = 1;
                                    `);
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


const addProject = async (req, res) => {
  const {
    Student_id,
    Course_id,
    ProjectName,
    ProjectDescription,
    ShowProject,
  } = req.body;

  try {
    
    
    const image = await FileUpload(req.files.image[0]);
    const file = await FileUpload(req.files.file[0]); 
    const project = await FileUpload(req.files.project[0]); 
    console.log(image.downloadURL)
    console.log(file.downloadURL)
    const result = await db.query(
      `INSERT INTO projects (Student_id, StudentImage, Course_id, ProjectName, ProjectDescription, ProjectFile, ShowProject, StudentProject) VALUES (?,?,?,?,?,?,?,?);`,
      [Student_id, image.downloadURL, Course_id, ProjectName, ProjectDescription, file.downloadURL, ShowProject, project.downloadURL]
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


const deleteProject = async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM projects WHERE Project_id = ?`, [
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

const updateProjectShow = async (req, res) => {
  
 
  try {
    const result = await db.query(
      `UPDATE projects
       SET ShowProject = 1
       WHERE Project_id = ?`,
       [req.params.id,]
    );

    console.log(result);
    res.status(200).json({
      success: true,
      message: 'ShowProject updated successfully',
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to update ShowProject',
      error,
    });
  }
};

const updateProjectUnShow = async (req, res) => {
  
 
  try {
    const result = await db.query(
      `UPDATE projects
       SET ShowProject = 0
       WHERE Project_id = ?`,
       [req.params.id,]
    );

    console.log(result);
    res.status(200).json({
      success: true,
      message: 'ShowProject updated successfully',
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to update ShowProject',
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


module.exports = { getAllProjects, getRemarkableProjects, addProject, deleteProject, getStudentProjects, updateProjectShow, updateProjectUnShow };