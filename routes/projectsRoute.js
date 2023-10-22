const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const {
    getAllProjects, 
    getRemarkableProjects, 
    addProject, 
    deleteProject,
    getStudentProjects,
} = require('../controllers/projectsController');

router.get('/getAllProjects', getAllProjects);
router.get('/getStudentProjects/:cId/:sId', getStudentProjects);
router.get('/getRemarkableProjects', getRemarkableProjects);
router.post('/add',upload.fields([{ name: 'image' }, { name: 'file' }, { name: 'project' }]), addProject);
router.delete('/delete/:id', deleteProject);


module.exports = router;