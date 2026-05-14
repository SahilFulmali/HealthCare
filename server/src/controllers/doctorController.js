const {Doctor} = require('../models/doctor');
const Appointment = require('../models/appointment');

exports.getAllDoctorInfo = async(req,res,next)=>{
    try {
        const allDoctor = await Doctor.find({});

        if (allDoctor.length > 0) {
            return res.status(200).json(allDoctor);
        } else {
            return res.status(404).json({
                message: "No Doctor Data Found in Database",
                status: false
        });
    }
  } catch (error) {
        next(error);
  }
}

exports.getDoctorById = async(req,res,next)=>{
    try{
        const id= req.params.id;
        const doctorInfo= await Doctor.findOne({doctorId:id});
        if(doctorInfo){
            return req.status(200).json(doctorInfo);
        }else {
            return req.status(404).json({
                message: `Doctor with Id: ${id} is not in database`,
                status: false
            })
        }
    }catch(err){
        next(err);
    }
}

exports.deleteAppointment = async(req,res,next) =>{
    try{
        const appointmentId= req.params.id;
        const result = await Appointment.deleteOne({appointmentId :appointmentId});

        if(result.deletedCount >0){
            return res.status(200).json({
                message:`Appointment : ${appointmentId} deleted successfully`,
                status:true
            })
        }else {
            return res.status(404).json({
                message: `Appointment ${appointmentId} doesnt exists`,
                status:false
            })
        }
    }catch(err){
        next(err)
    }
}

exports.getAllAppointments = async(req,res,next)=>{
    try{
        const doctorId= req.params.doctorId;

        const allAppointments = await Appointment.find({doctorId:doctorId});
        if(allAppointments.length>0){
            return res.status(200).json({
                message:"Appointments Fetched Sucessfully",
                status:true,
                data: allAppointments
            })
        }
        else {
            return res.status(404).json({
                message:"No Appointments Available",
                status:false,
            })
        }
    }
    catch(err){
        next(err)
    }
}

