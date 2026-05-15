import {inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';


import { DOCTORS } from '../mockdata/doctors.mock';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
});


export class DoctorService {
  httpClient=inject(HttpClient)

  constructor() {}

  deleteAppointment(appointmentId: string): Observable<any> {
    return this.httpClient.delete<any>(`http://localhost:5000/doctor/deleteAppointment/${appointmentId}`);
  }

  getAllDoctors(){
    return this.httpClient.get<Doctor[]>('http://localhost:5000/doctor/getAllDoctorInfo/');
  }
  // Get the loggedIn doctors-Sahil
  getDoctor(): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`http://localhost:5000/doctor/getDoctor`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.httpClient.get<Doctor>(`http://localhost:5000/doctor/getDoctorById/${id}`);
  }

  // Get doctors by department
  getDoctorsByDepartment(department: string): Doctor[] {
    return DOCTORS.filter(d => d.department === department);
  }

  // Get doctors by experience (minimum years)
  getDoctorsByExperience(minExperience: number): Doctor[] {
    return DOCTORS.filter(d => d.experience >= minExperience);
  }

  getUpcomingAppointments(): Observable<Appointment[]>{
    return this.httpClient.get<Appointment[]>('http://localhost:5000/doctor/upcomingAppointments')
  }
  
  getPastAppointments(): Observable<Appointment[]>{
    return this.httpClient.get<Appointment[]>('http://localhost:5000/doctor/pastAppointments')
  }
}