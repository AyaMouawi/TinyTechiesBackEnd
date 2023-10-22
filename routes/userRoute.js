const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
  getAllUsers,
  addUser,
  getUserByID,
  deleteUser,
  updateUser,
  loginUser,
  addStudent,
} = require('../controllers/userController');

router.get('/getAll', getAllUsers);
router.get('/get/:id', getUserByID);
router.post('/add', upload.single('image'), addUser);
router.post('/addStudent', addStudent);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);
router.post('/login', loginUser);


module.exports = router;