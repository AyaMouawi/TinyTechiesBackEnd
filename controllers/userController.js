const db = require('../config/db');
const bcrypt = require('bcrypt');

const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require('firebase/storage');

// Initialize Cloud Storage
const storage = getStorage();

const getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM users`);
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

const loginUser = async (req, res) => {
  const { UserEmail, Password } = req.body;

  try {
    const [result] = await db.query(
      `SELECT User_id, Role, Password FROM users WHERE UserEmail = ?`,
      [UserEmail]
    );

    if (!result) {
      res.status(401).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const hashedPassword = result[0].Password;
    console.log('Entered Password:', Password);
    console.log('Hashed Password:', hashedPassword);

    const passwordMatch = await bcrypt.compare(Password, hashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong password',
        role: result[0].Role,
        userId: result[0].User_id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      role: result[0].Role,
      userId: result[0].User_id,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to log in',
      error: error.message,
    });
  }
};





const getUserByID = async (req, res) => {
  try {
    const [result] = await db.query(`SELECT * FROM users WHERE User_id = ?`, [
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


const addUser = async (req, res) => {
  const {
    UserFullName,
    Password,
    UserEmail,
    UserAge,
    UserAbsence,
    Role
  } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    const image = await FileUpload(req.file);
    const result = await db.query(
      `INSERT INTO users (UserFullName, Password, UserEmail, UserAge, UserAbsence, Role, TrainerImage) VALUES (?,?,?,?,?,?,?);`,
      [UserFullName, hashedPassword, UserEmail, UserAge, UserAbsence, Role, image.downloadURL]
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


const addStudent = async (req, res) => {
  const {
    UserFullName,
    Password,
    UserEmail,
    UserAge,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const result = await db.query(
      `INSERT INTO users (UserFullName, Password, UserEmail, UserAge, UserAbsence, Role, TrainerImage) VALUES (?,?,?,?,?,?,?);`,
      [UserFullName, hashedPassword, UserEmail, UserAge, 0, 'Student', null]
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


const deleteUser = async (req, res) => {
  try {
    const [result] = await db.query(`DELETE FROM users WHERE User_id = ?`, [
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


const updateUser = async (req, res) => {
  const { UserFullName, Password, UserEmail, UserAge, UserAbsence, Role } = req.body;
  const userId = req.params.id;

  try {
    const result = await db.query(
      `UPDATE users SET UserFullName = ?, Password = ?, UserEmail = ?, UserAge = ?, UserAbsence = ?, Role = ? WHERE User_id = ?`,
      [UserFullName, Password, UserEmail, UserAge, UserAbsence, Role, userId]
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

module.exports = { getAllUsers, addUser, getUserByID, deleteUser, updateUser, loginUser, addStudent};