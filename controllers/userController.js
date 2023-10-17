const db = require('../config/db');

const getAllUsers = async (req, res) =>{ // Name the function according to the table example : getAllProjects
    try {
        const [result] = await db.query(`SELECT* FROM users`); // The query change according to the table
        res.status(200).json({
            success: true,
            message: 'data retrieved successfully',
            data: result,
        });
    } catch (error){
        res.status(400).json({
            success: false,
            message: 'unable to get data',
            error,
        });
    }};

    const getUserByID = async (req, res) => {
        try {
          const [result] = await db.query(`SELECT * FROM users WHERE User_id = ?`, [
            req.params.id,
          ]);
          res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: result,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Unable to add new user',
            error,
          });
        }
      };

      const deleteUser= async (req, res) => {
        try {
          const [result] = await db.query(`DELETE * FROM users WHERE User_id = ?`, [
            req.params.id,
          ]);
          res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: result,
          });
        } catch (error) {
          res.status(400).json({
            success: false,
            message: 'Unable to add new user',
            error,
          });
        }
      };







    module.exports = { getAllUsers, getUserByID, deleteUser};  // export the functions names you wrote