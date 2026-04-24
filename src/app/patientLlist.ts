export const patientList = [
  {
    patientId: 1,
    name: "Ravi Kumar",
    age: 35,
    gender: "Male",
    bloodGroup:"O+",

    email:"123@gmail.com",
    password:"12345",

    contact: "9876543210",
    address: "Bengaluru, India",

    medicalHistory: ["Hypertension", "Diabetes"],
    allergy:["lactose"],

    //devang , book appoitnment and add doctor id here
    doctorAssigned: [1,2,3],

    
    consulations:[123,224,355]
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 28,
    gender: "Female",
    contact: "9123456780",
    address: "Mumbai, India",
    medicalHistory: ["Asthma"],
    currentMedications: ["Salbutamol Inhaler"],
    doctorAssigned: [1,2,],// Sujay Mehta (Gynecology)
    appointments: [{appoitmentId:123,doctorId:2}]
  },
  {
    id: 3,
    name: "Arjun Patel",
    age: 42,
    gender: "Male",
    contact: "9988776655",
    address: "Pune, India",
    medicalHistory: ["High Cholesterol"],
    currentMedications: ["Atorvastatin"],
    doctorAssigned: [1,2,3], // Sahil Fulmali (E&T)
     appointments: [{appoitmentId:123,doctorId:2}]
    
  },
  {
    id: 4,
    name: "Neha Verma",
    age: 31,
    gender: "Female",
    contact: "9765432109",
    address: "Delhi, India",
    medicalHistory: ["Thyroid Disorder"],
    currentMedications: ["Levothyroxine"],
    doctorAssigned: [1,3], // Sahil Fulmali (E&T)
     appointments: [{appoitmentId:123,doctorId:2}]
    
  },
  {
    id: 5,
    name: "Karan Singh",
    age: 50,
    gender: "Male",
    contact: "9345678901",
    address: "Chennai, India",
    medicalHistory: ["Coronary Artery Disease"],
    currentMedications: ["Aspirin", "Beta Blockers"],
    doctorAssigned: [1,3], // Sai Anand (Cardiologist)
     appointments: [{appoitmentId:123,doctorId:2}]
    
  }
];
