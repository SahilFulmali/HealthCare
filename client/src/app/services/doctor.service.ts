import {inject, Injectable } from '@angular/core';
import { Doctor } from '../models/doctor.model';


import { DOCTORS } from '../mockdata/doctors.mock';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  httpClient=inject(HttpClient)

  constructor() {}

  deleteAppointment(Appointmentid:number){
    console.log("Appointment Deleted Sucessfully !!!");
    console.log(`${Appointmentid}`);
  }
  getAllDoctors(){
    return this.httpClient.get<Doctor[]>('http://localhost:5000/doctor/getAllDoctorInfo/');
  }
  // Get the loggedIn doctors-Sahil
  getDoctor(): Doctor {
    return this.httpClient.get<Doctor>('http://localhost:5000/doctor/getDoctor/');
  }

  // Get doctor by ID
  getDoctorById(id: number): Doctor | undefined {
    return this.httpClient.get<Doctor>('http://localhost:5000/doctor/getDoctorById/:id');
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