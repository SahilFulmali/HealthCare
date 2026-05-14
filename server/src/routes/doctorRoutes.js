const express = require('express');
const router = express.Router();

const {profileInfo,getAllDoctorInfo,getDoctorById,getAllAppointments} = require('../controllers/doctorController');

// router.get('/profile',profileInfo);


router.get('/allDoctor',getAllDoctorInfo);

router.get('/getDoctorById/:id',getDoctorById);

router.get('/allAppointments',getAllAppointments)


module.exports=router;