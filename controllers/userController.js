const db = require('../config/db');

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
  const { UserFullName, Password, UserEmail, UserAge, UserAbsence, Role } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO users (UserFullName, Password, UserEmail, UserAge, UserAbsence, Role) VALUES (?,?,?,?,?,?);`,
      [UserFullName, Password, UserEmail, UserAge, UserAbsence, Role]
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


module.exports = { getAllUsers, addUser, getUserByID, deleteUser, updateUser};