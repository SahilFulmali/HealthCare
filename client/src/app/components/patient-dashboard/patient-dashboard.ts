import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';

import { Patient } from '../../models/patient.model';
import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';
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

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.loadPatient();
  }

  /* ---------------- PATIENT ---------------- */
  private loadPatient(): void {
    this.patientDetails = this.authService.getLoggedInPatient();

    if (!this.patientDetails) return;

    this.loadAppointments(this.patientDetails.patientId);
    this.medicalHistory = this.patientDetails.medicalHistory;
  }

  get patientInitials(): string {
    return this.patientDetails?.name
      .split(' ')
      .map(n => n[0])
      .join('') || '';
  }

  /* ---------------- APPOINTMENTS ---------------- */
  private loadAppointments(patientId: number): void {
    const rawAppointments: Appointment[] =
      this.appointmentService.getByPatientId(patientId);

    this.appointments = rawAppointments.map(app => {
      const doctor: Doctor | undefined =
        this.doctorService.getDoctorById(app.doctor);

      return {
        ...app,
        doctorName: doctor ? doctor.name : 'Unknown Doctor'
      };
    });
  }


  /*  UPCOMING (Scheduled) */
  get upcomingAppointments(): (Appointment & { doctorName: string })[] {
    return this.appointments.filter(a => a.status === 'Scheduled'); 
  }

  /*  PAST (Completed) */
  get pastAppointments(): (Appointment & { doctorName: string })[] {
    return this.appointments.filter(a => a.status !== 'Scheduled');
  }

  /*  NEXT UPCOMING APPOINTMENT */
  get nextAppointment(): (Appointment & { doctorName: string }) | null {
    return (
      this.appointments
        .filter(a => a.status === 'Scheduled')
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )[0] || null
    );
  }

  /*  COUNTS */
  get upcomingCount(): number {
    return this.appointments.filter(a => a.status === 'Scheduled').length;
  }

  get completedCount(): number {
    return this.appointments.filter(a => a.status !== 'Scheduled').length;
  }

  /*  FILTERED APPOINTMENTS FOR UI */
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
      contact: this.patientDetails.contact ?? '',
      address: this.patientDetails.address ?? '',
      allergy: this.patientDetails.allergy
        ? [...this.patientDetails.allergy]
        : []
    };

    this.isEditingPersonal = true;
  }

  cancelPersonalEdit(): void {
    this.isEditingPersonal = false;
  }

  get isPersonalDetailsChanged(): boolean {
  if (!this.patientDetails) return false;

  return (
    this.editableDetails.email !== this.patientDetails.email ||
    this.editableDetails.contact !== this.patientDetails.contact ||
    this.editableDetails.address !== this.patientDetails.address ||
    JSON.stringify(this.editableDetails.allergy) !==
      JSON.stringify(this.patientDetails.allergy)
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

    setTimeout(() => {
      this.showSavedBanner = false;
    }, 2500);
  }
}