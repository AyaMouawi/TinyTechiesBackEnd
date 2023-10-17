const express = require('express');
const router = express.Router();

const { // you get the functions name you wrote in the coresponding controller 
    getAllUsers, 
    getUserByID,
    deleteUser,
} = require('../controllers/userController'); // the controller change according to the folder name example :'../controllers/projectController'

router.get('/getAll' , getAllUsers); // put the function name corresponding to what you wrote in the controller
router.get('/get/:id' , getUserByID);
router.delete('/delete/:id' , deleteUser)

module.exports  = router;