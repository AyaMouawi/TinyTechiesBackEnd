const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  addUser,
  getUserByID,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

router.get('/getAll', getAllUsers);
router.get('/get/:id', getUserByID);
router.post('/add', addUser);
router.delete('/delete/:id', deleteUser);
router.put('/update/:id', updateUser);


module.exports = router;