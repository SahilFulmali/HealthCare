import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:5000/patient'; 

  constructor() {}

  // 1. READ: Saari appointments database se lana
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAll`);
  }

  // 2. READ: ID se single appointment dhoodhna
  getById(appointmentId: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/getById/${appointmentId}`);
  }

  // 3. READ: Kisi specific Patient ki saari appointments lana
  getByPatientId(patientId: string | number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/patient/${patientId}`);
  }

  // 4. READ: Kisi specific Doctor ki saari appointments lana
  getByDoctorId(doctorId: string | number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/doctor/${doctorId}`);
  }

  // 5. CREATE: Nayi appointment book karna (Jo abhi humne controller banaya)
  book(appointmentData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/book-appointment`, appointmentData);
  }

  // 6. UPDATE: Appointment modify karna (Aapke modifyAppointment controller ke liye)
  update(appointmentId: string, updatedData: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/modify-appointment/${appointmentId}`, updatedData);
  }

  // 7. DELETE / CANCEL: Appointment cancel karna
  cancel(appointmentId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cancel/${appointmentId}`);
  }
}