const db = require('../config/db');

const getStudentsByCourseName = async (req, res) => {
    const { CourseName } = req.params;

    try {
        
        const query = 'SELECT users.* FROM courses JOIN studentcourses ON courses.Course_id = studentcourses.Course_id JOIN users ON studentcourses.Student_id = users.User_id WHERE courses.CourseName = ?';
        const [result] = await db.query(query, [CourseName]);

        res.status(200).json({
            success: true,
            message: 'Data retrieved successfully',
            data: result,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Unable to get data',
            error: error.message,
        });
    }
};

const Enroll = async (req, res) => {
    const { Student_id, Course_id} = req.body;
    try {
      const result = await db.query(
        `INSERT INTO studentcourses (Course_id , Student_id) VALUES (?,?);`,
        [Course_id , Student_id]
      );
      
      console.log(result);
      res.status(201).json({
        success: true,
        message: 'data added successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Unable to add new data',
        error,
      });
    }
  };


module.exports = { getStudentsByCourseName, Enroll };