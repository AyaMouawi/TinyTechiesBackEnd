const db = require('../config/db');

const getCounts = async (req, res) => {
  try {
    const [studentResult] = await db.query(`SELECT COUNT(*) AS StudentCount
                                    FROM users
                                    WHERE Role = 'Student'`);

    const [trainerResult] = await db.query(`SELECT COUNT(*) AS TrainerCount
                                      FROM users
                                      WHERE Role = 'Trainer'`);

    const [coursesResult] = await db.query(`SELECT COUNT(*) AS CoursesCount 
                                        FROM courses`);

    const [projectResult] = await db.query(`SELECT COUNT(*) AS ProjectCount 
                                        FROM projects`);

    res.status(200).json({
      success: true,
      message: 'Data retrieved successfully',
      data: {
        StudentCount: studentResult[0].StudentCount,
        TrainerCount: trainerResult[0].TrainerCount,
        CoursesCount: coursesResult[0].CoursesCount,
        ProjectCount: projectResult[0].ProjectCount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Unable to get new data',
      error,
    });
  }
};

module.exports = { getCounts };
