const express = require('express');
const router = express.Router();

const { getPatientDashboard, updatePatient} = require('../controllers/patientController');
const { bookAppointment, updateAppointment } = require('../controllers/appointmentController');


router.get('/dashboard/:patientId',getPatientDashboard)
router.patch('/updatePatient/:patientId',updatePatient)
router.post('/book-appointment',bookAppointment);
router.patch('/modify-appointment/:appointmentId',updateAppointment)


module.exports=router;