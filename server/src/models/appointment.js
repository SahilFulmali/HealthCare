const mongoose= require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    appointmentId:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    doctorId:{
        type:String,
        required:true
    },
    patientId:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    time:{                  //Devang added
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Completed","Scheduled"],
        required:true
    },

},{timestamps:true})

const Appointment = mongoose.model('Appointment',AppointmentSchema);

module.exports = Appointment;