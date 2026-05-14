const bcrypt = require('bcrypt');
const Patient = require('../models/patient');
const jwt = require("jsonwebtoken")

exports.registerPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      contactNumber,
      email,
      password,
      address,
      medicalHistory,
      allergy
    } = req.body;

    
    const existingPatient = await Patient.findOne({ email });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient already exists with this email'
      });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const lastPatient = await Patient.findOne().sort({ patientId: -1 });

    const newPatientId = lastPatient ? lastPatient.patientId + 1 : 1;


    const newPatient = new Patient({
      patientId: newPatientId,
      name,
      age,
      gender,
      contactNumber,
      email,
      password: hashedPassword,
      address,

      
      medicalHistory: medicalHistory || [],
      allergy: allergy || []
    });

    
    await newPatient.save();

   
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      patient: {
        patientId: newPatient.patientId,
        name: newPatient.name,
        email: newPatient.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};




exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Patient.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid password'
      });
    }

    const payload = {
        pId : user.patientId,
        pemail: user.email
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRY})


    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};
