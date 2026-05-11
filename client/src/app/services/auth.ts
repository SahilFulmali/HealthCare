import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from '../model/doctor';
import { Patient } from '../model/patient';
import { patientList } from '../data/patientData';
import { doctorList } from '../data/doctorData';

export type UserRole = 'PATIENT' | 'DOCTOR'

@Injectable({
  providedIn: 'root',
})
export class Auth {

  
 
 constructor(private router: Router) {}



  private isLoggedIn = false;
  private role: UserRole | null = null;
  private currentUser: Doctor | Patient | null = null;



  

  
loginPatient(email: string, password: string): boolean {
    const patient = patientList.find(
      p => p.email === email && p.password === password
    );

    if (patient) {
      this.isLoggedIn = true;
      this.role = 'PATIENT';
      this.currentUser = patient;
      return true;
    }
    return false;
  }

  
loginDoctor(doctorId: number, password: string): boolean {
    const doctor = doctorList.find(
      d => d.doctorId === doctorId && d.password === password
    );

    if (doctor) {
      this.isLoggedIn = true;
      this.role = 'DOCTOR';
      this.currentUser = doctor;
      return true;
    }
    return false;
  }




  
  
 authenticated(): boolean {
    return this.isLoggedIn;
  }

  getRole(): UserRole | null {
    return this.role;
  }

  getCurrentUser(): Doctor | Patient | null {
    return this.currentUser;
  }
}





  

