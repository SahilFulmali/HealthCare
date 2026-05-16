const express = require('express');
const router = express.Router();

const { getPatientDashboard, updatePatient, downloadPrescriptionData, viewPrescription} = require('../controllers/patientController');
const { bookAppointment, modifyAppointment, getById } = require('../controllers/appointmentController');


router.get('/dashboard/:patientId',getPatientDashboard)
router.patch('/updatePatient/:patientId',updatePatient)
router.post('/book-appointment',bookAppointment);
router.patch('/modify-appointment/:appointmentId',modifyAppointment)
router.get('/getById/:appointmentId', getById);


router.get('/download-prescription/:consultationId',downloadPrescriptionData)
router.get('/view-prescription/:consultationId',viewPrescription)

module.exports=router;