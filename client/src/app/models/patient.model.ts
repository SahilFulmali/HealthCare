export interface Patient {
  patientId: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  medicalHistory: string[];
  allergy: string[];
  doctorAssigned: number[];
  consulations: number[]; 
}
