const express = require('express');
const router = express.Router();

const {
    profileInfo,
    getAllDoctorInfo,
    getDoctorById,
    getAllAppointments,
    getUpcomingAppointments} = require('../controllers/doctorController');

// router.get('/profile',profileInfo);


router.get('/allDoctor',getAllDoctorInfo);

//add this in doctor Controller
//router.get('/getDoctor',getDoctor);

router.get('/getDoctorById/:id',getDoctorById);

router.get('/allAppointments',getAllAppointments);

router.get('/upcomingAppointments',getUpcomingAppointments);

router.get('/pastAppointments',getPastAppointments);



module.exports=router;