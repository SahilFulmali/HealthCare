const Patient = require('../models/patient')
const Appointment = require('../models/appointment')

exports.getPatientDashboard = async (req,res,next) =>{
    try{
        const patientId=String(req.params.patientId);
        const patientList = await Patient.findOne({patientId:patientId});

        if(!patientList){
            return res.status(404).json({message : 'Patient not Found'});
        }

        const appointments = await Appointment.find({patientId:patientId});

        res.status(200).json({message:'Patient Dashbaord Fetched Successfully',patientList,appointments});
    }catch(err){
        next(err);
    }
}


exports.updatePatient = async (req, res) => {
  try {
    const patientId=String(req.params.patientId)
    //const patientId = req.user.id;

    const updates = {};

    if (req.body.email) updates.email = req.body.email;
    if (req.body.contactNumber) updates.contactNumber = req.body.contactNumber;
    if (req.body.address) updates.address = req.body.address;
    if (req.body.allergy) updates.allergy = req.body.allergy;

    const updatedPatient = await Patient.findOneAndUpdate({patientId} , { $set: updates }, { new: true } );

    res.status(201).json({message: "Patient updated successfully", patient: updatedPatient });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

