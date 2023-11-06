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

  const getAllStudents = async (req, res) => {
    try {
      const selectQuery = `
        SELECT u.*, COUNT(a.Student_id) AS AbsenceCount
        FROM users u
        LEFT JOIN attendance a ON u.User_id = a.Student_id AND a.PresenceStatus = 1
        WHERE u.Role = 'Student'
        GROUP BY u.User_id;
      `;
      const [result] = await db.query(selectQuery);
  
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
  
  

  const getAllStudentsAndCourses = async (req, res) => {
    try {
      const query = `
      SELECT u.*, GROUP_CONCAT(c.CourseName) AS EnrolledCourses,
      (SELECT COUNT(*) FROM attendance a WHERE a.Student_id = u.User_id AND a.PresenceStatus = 0) AS Absence
      FROM users u
      LEFT JOIN studentcourses sc ON u.User_id = sc.Student_id
      LEFT JOIN courses c ON sc.Course_id = c.Course_id
      WHERE u.Role = 'Student'
      GROUP BY u.User_id
      `;
      const [result] = await db.query(query);
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

module.exports = { getStudentsByCourseName, Enroll, getAllStudents, getAllStudentsAndCourses };