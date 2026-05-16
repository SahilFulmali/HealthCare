import { Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core'; // 👈 ChangeDetectorRef import kiya
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

import { Doctor } from '../../models/doctor.model';
import { Appointment } from '../../models/appointment.model';

interface TimeSlot {
  time: string;
  disabled: boolean;
}

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bookappointment.html',
  styleUrl: './bookappointment.css'
})
export class BookAppointment implements OnInit {

  @ViewChild('apptForm') apptForm!: NgForm;

  booked = false;

  appointment = {
    doctorId: '',
    date: '',
    time: '',
    mode: '',
    reason: ''
  };

  doctors: Doctor[] = [];
  availableDates: string[] = [];
  timeSlots: TimeSlot[] = [];

  private doctorService = inject(DoctorService);
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // 👈 1. Change detector inject kiya

  constructor() {}

  ngOnInit(): void {
    // 2. Fetch doctors on load
    this.doctorService.getAllDoctors().subscribe({
      next: (data: any) => {
        this.doctors = Array.isArray(data) ? data : (data.allDoctor || []);
        console.log("Dropdown ke liye Doctors loaded:", this.doctors);
        
        // 👈 3. CRITICAL FIX: Angular ko force kiya view refresh karne ke liye
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error fetching doctors:', err)
    });
    
    this.generateNextFiveDays();
  }

  private generateNextFiveDays(): void {
    const today = new Date();
    this.availableDates = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      this.availableDates.push(d.toISOString().split('T')[0]);
    }
    this.cdr.detectChanges();
  }

  onDateChange(): void {
    this.appointment.time = '';
    this.generateTimeSlots();
    this.cdr.detectChanges();
  }

 generateTimeSlots(): void {
    this.timeSlots = [];
    const doctorId = this.appointment.doctorId;
    const date = this.appointment.date;
    
    // Agar dono me se ek bhi missing hai toh state clear karke refresh karo
    if (!doctorId || !date) {
      this.cdr.detectChanges();
      return;
    }

    const url = `http://localhost:5000/api/availability/slots?doctorId=${doctorId}&date=${date}`;
    
    this.http.get<{ status: boolean, slots: any[] }>(url).subscribe({
      next: (res) => {
        console.log("Backend se mile slots response:", res);
        
        if (res && res.slots && res.slots.length > 0) {
          this.timeSlots = res.slots.map(s => ({
            time: s.time,
            disabled: s.isBooked
          }));
        } else {
          this.timeSlots = []; // Agar slots array khali mile toh clear karo
        }
        
        // 👈 CRITICAL FIX: Slots array map hote hi view ko force refresh kiya
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error fetching slots from DB:', err);
        this.timeSlots = [];
        
        // 👈 CRITICAL FIX: Error handling par bhi UI text clean push karo
        this.cdr.detectChanges();
      }
    });
  }

submitAppointment(): void {
    console.log("=== SUBMIT TRIGGERED ===");
    
    if (this.apptForm.invalid) {
      this.apptForm.form.markAllAsTouched();
      return;
    }

    const patient = this.authService.getLoggedInPatient();
    if (!patient) {
      console.error("Patient log-in context nahi mila!");
      return;
    }

    // Console me check karo ki patient._id aa rahi hai ya nahi
    console.log("Logged in Patient Full Data:", patient);

    // ✅ FIX 3: Custom payload banaya jo backend schema se exact match karega
    const bookingPayload = {
    patient_id: (patient as any)._id,
      doctorId: String(this.appointment.doctorId),
      date: this.appointment.date,
      time: this.appointment.time,
      mode: this.appointment.mode,
      reason: this.appointment.reason
    };

    console.log("Payload going to Backend:", bookingPayload);

    this.appointmentService.book(bookingPayload as any).subscribe({
      next: (res: any) => {
        console.log('Database confirmation successful:', res);
        
        this.booked = true; 
        this.cdr.detectChanges(); 
        
        setTimeout(() => {
          this.booked = false;
          this.apptForm.resetForm();
          this.appointment = { doctorId: '', date: '', time: '', mode: '', reason: '' };
          this.timeSlots = [];
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err: any) => {
        console.error('Database insertion failed:', err);
      }
    });
  }
}