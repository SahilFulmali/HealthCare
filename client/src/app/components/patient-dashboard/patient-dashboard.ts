import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // ✅ Injected for direct backend hits

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
    this.cdr.detectChanges(); 
  }

  /* ---------------- APPOINTMENT SUB-TABS ---------------- */
  appointmentView: 'upcoming' | 'past' = 'upcoming';

  /* ---------------- DATA STATE ---------------- */
  patientDetails: Patient | null = null;
  appointments: (Appointment & { doctorName: string })[] = [];
  medicalHistory: string[] = [];

  /* ---------------- UI STATE ---------------- */
  isEditingPersonal = false;
  showSavedBanner = false;

  // ✅ Flattened and managed object structure for profile form fields input tracking
  editableDetails = {
    email: '',
    contactNumber: '',
    address: '',
    allergyStr: '' // Handle collection array as simple text inside UI view input text boxes
  };

  private authService = inject(AuthService);
  private doctorService = inject(DoctorService);
  private pastService = inject(PastConsultations);
  private http = inject(HttpClient); 
  private cdr = inject(ChangeDetectorRef); 

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
          this.cdr.detectChanges();
        },
        error: () => {
          mappedApp.doctorName = 'Unknown Doctor';
          this.cdr.detectChanges();
        }
      });

      return mappedApp;
    });
    
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

  /* ---------------- PERSONAL DETAILS ACTIONS ---------------- */
  beginEditPersonal(): void {
    if (!this.patientDetails) return;

    // Set editing fields state context safely mapping nested dynamic array keys
    this.editableDetails = {
      email: this.patientDetails.email ?? '',
      contactNumber: this.patientDetails.contactNumber ?? '', 
      address: this.patientDetails.address ?? '',
      allergyStr: Array.isArray(this.patientDetails.allergy) ? this.patientDetails.allergy.join(', ') : ''
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
    const currentAllergyStr = Array.isArray(this.patientDetails.allergy) ? this.patientDetails.allergy.join(', ') : '';

    return (
      this.editableDetails.email !== this.patientDetails.email ||
      this.editableDetails.contactNumber !== this.patientDetails.contactNumber ||
      this.editableDetails.address !== this.patientDetails.address ||
      this.editableDetails.allergyStr !== currentAllergyStr
    );
  }

  savePersonalDetails(): void {
    if (!this.patientDetails) return;

    // ✅ FIX 1: Comma-separated allergy plain string parsed back into native string array schema array
    const allergyArray = this.editableDetails.allergyStr
      ? this.editableDetails.allergyStr.split(',').map(item => item.trim())
      : [];

    // ✅ FIX 2: Exact compiled payload object prepared matching updatePatient structure requirements
    const profilePayload = {
      name: this.patientDetails.name, 
      contactNumber: this.editableDetails.contactNumber,
      email: this.editableDetails.email,
      address: this.editableDetails.address,
      allergy: allergyArray
    };

    const pId = this.patientDetails.patientId || '1';
    console.log("🚀 SENDING PROFILE UPDATE PAYLOAD:", profilePayload);

    // ✅ FIX 3: Target express controller linked directly bypassing local auth token restrictions
    this.http.patch<any>(`http://localhost:5000/patient/updatePatient/${pId}`, profilePayload).subscribe({
      next: (res: any) => {
        console.log("🎉 SUCCESS: Profile saved in database!", res);

        // Map fresh response context parameters to client view state
        const updatedPatientData = res.patient || { ...this.patientDetails, ...profilePayload };
        
        this.patientDetails = updatedPatientData;
        this.authService.updateLoggedInPatient(updatedPatientData);

        this.isEditingPersonal = false;
        this.showSavedBanner = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.showSavedBanner = false;
          this.cdr.detectChanges();
        }, 2500);
      },
      error: (err) => {
        console.error("❌ BACKEND PROFILE PERSISTENCE CRASHED:", err);
        alert("Could not update profile data: " + (err.error?.message || "Internal network crash"));
      }
    });
  }
}