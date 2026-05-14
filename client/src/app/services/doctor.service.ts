import { Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';
import { DOCTORS } from '../mockdata/doctors.mock';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  constructor() {}

  deleteAppointment(Appointmentid:number){
        console.log("Appointment Deleted Sucessfully !!!");
        console.log(`${Appointmentid}`);
  }

  // Get all doctors
  getAllDoctors(): Doctor[] {
    return [...DOCTORS];
  }

  // Get doctor by ID
  getDoctorById(doctorId: number): Doctor | undefined {
    return DOCTORS.find(d => d.id === doctorId);
  }

  // Get doctors by department
  getDoctorsByDepartment(department: string): Doctor[] {
    return DOCTORS.filter(d => d.department === department);
  }

  // Get doctors by experience (minimum years)
  getDoctorsByExperience(minExperience: number): Doctor[] {
    return DOCTORS.filter(d => d.experience >= minExperience);
  }

  
}