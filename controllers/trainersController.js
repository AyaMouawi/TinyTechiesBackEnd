const db = require('../config/db');


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

 

  

  module.exports = { getAllTrainers, getTrainerByID, getTrainersFullName,  getTrainerCourses, getTrainerCoursesName};