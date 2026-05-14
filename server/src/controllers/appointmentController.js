const Appointment = require('../models/appointment');



// add appointment id to doctor schema as welll
exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, time } = req.body;
    if (!patientId || !doctorId || !date || !time) {
        return res.status(400).json({ message: "All fields are required"});
    }
    const count = await Appointment.countDocuments();
    const appointmentId = (count + 1).toString();
    const appointment = await Appointment.create({ appointmentId, doctorId, patientId, date, time, status: "Scheduled" });
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.modifyAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    const { date, time, status } = req.body;

    const updates = {};

    if (date) updates.date = date;
    if (time) updates.time = time;
    if (status) updates.status = status;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided to update"
      });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { appointmentId: appointmentId },
      { $set: updates },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
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