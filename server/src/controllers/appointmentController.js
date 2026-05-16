const Appointment = require('../models/appointment');
const Availability = require('../models/availability'); 
const Doctor = require('../models/doctor');            

// 1. BOOK APPOINTMENT (With Slot Locking & Doctor Reference)
exports.bookAppointment = async (req, res) => {
  try {
    // ✅ FIX 1: req.body se patient ki asli MongoDB _id mangwai (Na ki custom patientId)
    const { patient_id, doctorId, date, time } = req.body; 
    
    if (!patient_id || !doctorId || !date || !time) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const count = await Appointment.countDocuments();
    const appointmentId = (count + 1).toString();
    
    // ✅ FIX 2: Schema ke 'patient' key ke andar patient_id (ObjectId) pass ki
    const appointment = await Appointment.create({ 
      appointmentId, 
      doctorId, 
      patient: patient_id, // Map strictly to schema's patient field
      date: new Date(date), 
      time, 
      status: "Scheduled" 
    });

    // Availability table lock logic (Same)
    const searchDate = new Date(date);
    searchDate.setHours(0,0,0,0);
    await Availability.updateOne(
        { doctorId: String(doctorId), date: searchDate, "slots.time": time },
        { $set: { "slots.$.isBooked": true } }
    );

    // Doctor table update logic (Same)
    await Doctor.updateOne(
        { doctorId: String(doctorId) },
        { $push: { appointments: appointment._id } }
    );

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    console.error("Booking catch error:", err.message);
    res.status(500).json({ message: err.message });
  }
};


// 2. MODIFY APPOINTMENT (With Old Slot Release & New Slot Locking)
exports.modifyAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { date, time, status } = req.body;

    // Pehle purani appointment details nikalte hain taaki pata chale purana slot kaunsa khali karna hai
    const oldAppointment = await Appointment.findOne({ appointmentId: appointmentId });
    if (!oldAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    const updates = {};
    if (date) updates.date = date;
    if (time) updates.time = time;
    if (status) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    // Appointment to Update kiya database mein
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: appointmentId },
      { $set: updates },
      { new: true }
    );

    // ✅ STEP C: Agar date ya time badla hai, toh availability manage karo
    if (date || time) {
      // 1. Purane doctor/date/time wale slot ko wapas FREE karo (isBooked: false)
      const oldDate = new Date(oldAppointment.date);
      oldDate.setHours(0,0,0,0);
      await Availability.updateOne(
          { doctorId: String(oldAppointment.doctorId), date: oldDate, "slots.time": oldAppointment.time },
          { $set: { "slots.$.isBooked": false } }
      );

      // 2. Naye dynamic date/time wale slot ko LOCK karo (isBooked: true)
      const newDate = new Date(updatedAppointment.date);
      newDate.setHours(0,0,0,0);
      await Availability.updateOne(
          { doctorId: String(updatedAppointment.doctorId), date: newDate, "slots.time": updatedAppointment.time },
          { $set: { "slots.$.isBooked": true } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment
    });

  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};