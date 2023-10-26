const db = require('../config/db');

const addAttendance = async (req, res) => {
  const { Student_id, CourseName } = req.body; // Include CourseName in the request

  const presence = 1;
  const day = new Date();

  try {
    // Use a subquery to get Course_id based on the CourseName
    const query = `
      INSERT INTO attendance (Student_id, PresenceStatus, AttendanceDate, Course_id)
      VALUES (?, ?, ?, (
        SELECT Course_id
        FROM courses
        WHERE CourseName = ?
      ));
    `;

    const result = await db.query(query, [Student_id, presence, day, CourseName]);

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

module.exports = { addAttendance };
