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

    const getUserByID = async (req, res) => { // naming change
        try {
          const [result] = await db.query(`SELECT * FROM users WHERE User_id = ?`, [ // the query change
            req.params.id,
          ]);
          res.status(200).json({
            success: true,
            message: 'data retrieved successfully',
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

      const deleteUser= async (req, res) => { //naming change 
        try {
          const [result] = await db.query(`DELETE FROM users WHERE User_id = ?`, [ // the query changes 
            req.params.id,
          ]);
          res.status(200).json({
            success: true,
            message: 'data deleted successfully',
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

    const addUser = async (req, res) => {
        const {UserFullName , Password , UserEmail , UserAge , UserAbsence, Role} = req.body;  // change according to the fields of the table you are working on 
        try {
            const result = await db.query ('INSERT INTO users (UserFullName , Password , UserEmail , UserAge , UserAbsence, Role) VALUES (?,?,?,?,?,?);',// change according to the fields of the table you are working on 
            [UserFullName , Password , UserEmail , UserAge , UserAbsence, Role]); // change according to the fields of the table you are working on 

            res.status(201).json({
                success: true,
                message: 'User added successfully',
              });
            } catch (error) {
              res.status(400).json({
                success: false,
                message: 'Unable to add new user',
                error,
              });
            }  
        };

    
        const updateUser = async (req, res) => {
            const { UserFullName, Password, UserEmail, UserAge, UserAbsence, Role } = req.body;  // change according to the fields of the table you are working on 
            const userId = req.params.id;
          
            try {
              const result = await db.query(
                `UPDATE users SET UserFullName = ?, Password = ?, UserEmail = ?, UserAge = ?, UserAbsence = ?, Role = ? WHERE User_id = ?`,  // change according to the fields of the table you are working on 
                [UserFullName, Password, UserEmail, UserAge, UserAbsence, Role, userId]  // change according to the fields of the table you are working on 
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







    module.exports = { getAllUsers, getUserByID, deleteUser, addUser, updateUser};  // export the functions names you wrote