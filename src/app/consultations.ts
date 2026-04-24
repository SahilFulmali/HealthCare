export const consulation = [
  {
    patientID: 1,
    
    consultations: [
      {
        consultationID: 101,
        appointmentId: 201,
        doctorId: 1,
        notes: "Cough and mild fever",
        prescriptions: [
          { name: 'Expectorant', dosage: '1 tablet', route: 'Oral', frequency: 'Every 4 hours' },
          { name: 'Paracetamol', dosage: '1 tablet', route: 'Oral', frequency: 'Every 6 hours' }
        ],
       
      },
      {
        consultationID: 102,
        doctorId: 2,
        notes: "Follow-up for fever",
        prescriptions: [
          { name: 'Vitamin C', dosage: '500mg', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 202
      },
      {
        consultationID: 103,
        doctorId: 3,
        notes: "Headache complaint",
        prescriptions: [
          { name: 'Ibuprofen', dosage: '400mg', route: 'Oral', frequency: 'Every 8 hours' }
        ],
        appointmentId: 203
      },
      {
        consultationID: 104,
        doctorId: 4,
        notes: "Seasonal allergy",
        prescriptions: [
          { name: 'Antihistamine', dosage: '10mg', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 204
      }
    ]
  },
  {
    patientID: 2,
    consultations: [
      {
        consultationID: 105,
        doctorId: 2,
        notes: "Stomach pain",
        prescriptions: [
          { name: 'Antacid', dosage: '1 tablet', route: 'Oral', frequency: 'Twice a day' }
        ],
        appointmentId: 205
      },
      {
        consultationID: 106,
        doctorId: 3,
        notes: "Nausea",
        prescriptions: [
          { name: 'Ondansetron', dosage: '4mg', route: 'Oral', frequency: 'Every 8 hours' }
        ],
        appointmentId: 206
      },
      {
        consultationID: 107,
        doctorId: 4,
        notes: "Routine check-up",
        prescriptions: [
          { name: 'Multivitamin', dosage: '1 tablet', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 207
      },
      {
        consultationID: 108,
        doctorId: 1,
        notes: "Back pain",
        prescriptions: [
          { name: 'Muscle relaxant', dosage: '10mg', route: 'Oral', frequency: 'Twice a day' }
        ],
        appointmentId: 208
      }
    ]
  },
  {
    patientID: 3,
    consultations: [
      {
        consultationID: 109,
        doctorId: 3,
        notes: "High blood pressure",
        prescriptions: [
          { name: 'Amlodipine', dosage: '5mg', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 209
      },
      {
        consultationID: 110,
        doctorId: 4,
        notes: "Diabetes management",
        prescriptions: [
          { name: 'Metformin', dosage: '500mg', route: 'Oral', frequency: 'Twice a day' }
        ],
        appointmentId: 210
      },
      {
        consultationID: 111,
        doctorId: 1,
        notes: "Routine blood test review",
        prescriptions: [],
        appointmentId: 211
      },
      {
        consultationID: 112,
        doctorId: 2,
        notes: "Cholesterol check",
        prescriptions: [
          { name: 'Atorvastatin', dosage: '20mg', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 212
      }
    ]
  },
  {
    patientID: 4,
    consultations: [
      {
        consultationID: 113,
        doctorId: 4,
        notes: "Asthma follow-up",
        prescriptions: [
          { name: 'Inhaler', dosage: '2 puffs', route: 'Inhalation', frequency: 'Twice a day' }
        ],
        appointmentId: 213
      },
      {
        consultationID: 114,
        doctorId: 1,
        notes: "Chest pain",
        prescriptions: [
          { name: 'Aspirin', dosage: '75mg', route: 'Oral', frequency: 'Once a day' }
        ],
        appointmentId: 214
      },
      {
        consultationID: 115,
        doctorId: 2,
        notes: "Skin rash",
        prescriptions: [
          { name: 'Topical cream', dosage: 'Apply thin layer', route: 'Topical', frequency: 'Twice a day' }
        ],
        appointmentId: 215
      },
      {
        consultationID: 116,
        doctorId: 3,
        notes: "Migraine",
        prescriptions: [
          { name: 'Sumatriptan', dosage: '50mg', route: 'Oral', frequency: 'As needed' }
        ],
        appointmentId: 216
      }
    ]
  },
  {
    patientID: 5,
    consultations: [
      {
        consultationID: 117,
        doctorId: 2,
        notes: "Joint pain",
        prescriptions: [
          { name: 'Naproxen', dosage: '250mg', route: 'Oral', frequency: 'Twice a day' }
        ],
        appointmentId: 217
      },
      {
        consultationID: 118,
        doctorId: 3,
        notes: "Eye infection",
        prescriptions: [
          { name: 'Eye drops', dosage: '2 drops', route: 'Ocular', frequency: 'Every 6 hours' }
        ],
        appointmentId: 218
      },
      {
        consultationID: 119,
        doctorId: 4,
        notes: "Ear pain",
        prescriptions: [
          { name: 'Ear drops', dosage: '3 drops', route: 'Otic', frequency: 'Twice a day' }
        ],
        appointmentId: 219
      },
      {
        consultationID: 120,
        doctorId: 1,
        notes: "Routine dental check",
        prescriptions: [],
        appointmentId: 220
      }
    ]
  }
];
