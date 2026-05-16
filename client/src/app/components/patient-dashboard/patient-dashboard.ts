import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // 👈 1. ChangeDetectorRef import kiya
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { DoctorService } from '../../services/doctor.service';
import { PastConsultations } from '../../services/past-consultations'; 

import { Patient } from '../../models/patient.model';
import { Appointment } from '../../models/appointment.model';
import { PastConsultationList } from '../past-consultation-list/past-consultation-list/past-consultation-list';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PastConsultationList],
  templateUrl: './patient-dashboard.html',
  styleUrls: ['./patient-dashboard.css']
})
export class PatientDashboard implements OnInit {

  /* ---------------- MAIN TABS ---------------- */
  activeTab: 'appointments' | 'history' | 'personal' = 'appointments';

  setActiveTab(tab: 'appointments' | 'history' | 'personal'): void {
    this.activeTab = tab;
    this.cdr.detectChanges(); // ✅ Tab switch par force-refresh loop
  }

  /* ---------------- APPOINTMENT SUB-TABS ---------------- */
  appointmentView: 'upcoming' | 'past' = 'upcoming';

  /* ---------------- DATA ---------------- */
  patientDetails: Patient | null = null;
  appointments: (Appointment & { doctorName: string })[] = [];
  medicalHistory: string[] = [];

  /* ---------------- UI STATE ---------------- */
  isEditingPersonal = false;
  showSavedBanner = false;
  editableDetails: Partial<Patient> = {};

  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private pastService = inject(PastConsultations);
  private cdr = inject(ChangeDetectorRef); // 👈 2. Change detector inject kiya

  constructor() {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /* ---------------- FETCH BACKEND DATA ---------------- */
  private loadDashboardData(): void {
    const patientId = localStorage.getItem('logged_in_patient_id') || '1';

    this.pastService.listAll(patientId).subscribe({
      next: (res) => {
        if (res && res.patientList) {
          this.patientDetails = res.patientList;
          this.medicalHistory = this.patientDetails?.medicalHistory || [];
          
          const rawAppointments: Appointment[] = res.appointments || [];
          this.processAppointmentsWithDoctors(rawAppointments);
          
          // 👈 3. CRITICAL FIX: Patient details update hote hi render push kiya
          this.cdr.detectChanges(); 
        }
      },
      error: (err) => console.error('Dashboard Fetch Error:', err)
    });
  }

  private processAppointmentsWithDoctors(rawAppointments: Appointment[]): void {
    this.appointments = rawAppointments.map(app => {
      const mappedApp = {
        ...app,
        doctorName: 'Loading...'
      };

      this.doctorService.getDoctorById(app.doctorId as any).subscribe({
        next: (doc) => {
          mappedApp.doctorName = doc ? doc.name : 'Unknown Doctor';
          // 👈 4. CRITICAL FIX: Doctor ka naam async aate hi table row refresh karo
          this.cdr.detectChanges();
        },
        error: () => {
          mappedApp.doctorName = 'Unknown Doctor';
          this.cdr.detectChanges();
        }
      });

      return mappedApp;
    });
    
    // Appointments loading complete hote hi final sync push karo
    this.cdr.detectChanges();
  }

  get patientInitials(): string {
    return this.patientDetails?.name
      ?.split(' ')
      ?.map(n => n[0])
      ?.join('') || '';
  }

  /* ---------------- APPOINTMENTS FILTERS ---------------- */
  get upcomingAppointments(): (Appointment & { doctorName: string })[] {
    return this.appointments.filter(a => a.status === 'Scheduled'); 
  }

  get pastAppointments(): (Appointment & { doctorName: string })[] {
    return this.appointments.filter(a => a.status !== 'Scheduled');
  }

  get nextAppointment(): (Appointment & { doctorName: string }) | null {
    const scheduled = this.appointments.filter(a => a.status === 'Scheduled');
    if (scheduled.length === 0) return null;
    
    return scheduled.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }

  get upcomingCount(): number {
    return this.appointments.filter(a => a.status === 'Scheduled').length;
  }

  get completedCount(): number {
    return this.appointments.filter(a => a.status !== 'Scheduled').length;
  }

  get filteredAppointments(): (Appointment & { doctorName: string })[] {
    if (this.appointmentView === 'upcoming') {
      return this.appointments.filter(a => a.status === 'Scheduled');
    }
    return this.appointments.filter(a => a.status !== 'Scheduled');
  }

  /* ---------------- PERSONAL DETAILS EDIT ---------------- */
  beginEditPersonal(): void {
    if (!this.patientDetails) return;

    this.editableDetails = {
      email: this.patientDetails.email ?? '',
      contactNumber: this.patientDetails.contactNumber ?? '', 
      address: this.patientDetails.address ?? '',
      allergy: this.patientDetails.allergy ? [...this.patientDetails.allergy] : []
    };

    this.isEditingPersonal = true;
    this.cdr.detectChanges();
  }

  cancelPersonalEdit(): void {
    this.isEditingPersonal = false;
    this.cdr.detectChanges();
  }

  get isPersonalDetailsChanged(): boolean {
    if (!this.patientDetails) return false;

    return (
      this.editableDetails.email !== this.patientDetails.email ||
      this.editableDetails.contactNumber !== this.patientDetails.contactNumber ||
      this.editableDetails.address !== this.patientDetails.address ||
      JSON.stringify(this.editableDetails.allergy) !== JSON.stringify(this.patientDetails.allergy)
    );
  }

  savePersonalDetails(): void {
    if (!this.patientDetails) return;

    const updatedPatient = {
      ...this.patientDetails,
      ...this.editableDetails
    };

    this.authService.updateLoggedInPatient(updatedPatient);
    this.patientDetails = updatedPatient;

    this.isEditingPersonal = false;
    this.showSavedBanner = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.showSavedBanner = false;
      this.cdr.detectChanges();
    }, 2500);
  }
}