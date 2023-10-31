const db = require('../config/db');

const addPresenceAttendance = async (req, res) => {
  const { Student_id, CourseName } = req.body; 
  const presence = 1;
  const day = new Date();

  try {
   
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

const addAbsentAttendance = async (req, res) => {
  const { Student_id, CourseName } = req.body; 
  const presence = 0;
  const day = new Date();

  try {
   
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

module.exports = { addPresenceAttendance, addAbsentAttendance  };
