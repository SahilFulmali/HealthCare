import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // 👈 Dynamic slots hit karne ke liye

import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';

import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';

interface TimeSlot {
  time: string;
  disabled: boolean;
}

@Component({
  selector: 'app-modify-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './modifyappointment.html',
  styleUrl: './modifyappointment.css'
})
export class Modifyappointment implements OnInit {

  appointment!: Appointment;
  doctor!: Doctor;

  availableDates: string[] = [];
  timeSlots: TimeSlot[] = [];

  // Angular 17+ inject pattern used
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorService);
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    // Route parameter se appointmentId nikala
    const id = this.route.snapshot.paramMap.get('appointmentId') || '';
    
    // ✅ FIX 1: Real backend database se active appointment data fetch kiya via subscription
    this.appointmentService.getById(id).subscribe({
      next: (appt: any) => {
        if (!appt) {
          this.router.navigate(['/patient']);
          return;
        }

        this.appointment = { ...appt };

        // Appointment milte hi uske doctor ki detail backend se nikalenge
        this.doctorService.getDoctorById(appt.doctorId).subscribe({
          next: (data: any) => {
            // Mongoose object data validation logic check wrapper
            const doctorData = data?.doctor || data;
            if (doctorData) {
              this.doctor = doctorData;
              this.generateTimeSlots(); // ✅ Load dynamic database slots
            }
          },
          error: (err: any) => console.error('Error fetching doctor detail:', err)
        });
      },
      error: (err: any) => {
        console.error('Error fetching appointment:', err);
        this.router.navigate(['/patient']);
      }
    });

    this.generateNextFiveDays();
  }

  /* ---------- DATES ---------- */
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
    if (this.appointment) {
      this.appointment.time = '';
      this.generateTimeSlots();
    }
  }

  /* ---------- FETCH LIVE TIME SLOTS FROM BACKEND ---------- */
  generateTimeSlots(): void {
    this.timeSlots = [];

    if (!this.appointment || !this.appointment.doctorId || !this.appointment.date) return;

    const doctorId = this.appointment.doctorId;
    const date = this.appointment.date;

    // ✅ FIX 2: Mock array filter hata kar real dynamic slots API call mari
    const url = `http://localhost:5000/api/availability/slots?doctorId=${doctorId}&date=${date}`;
    
    this.http.get<{ status: boolean, slots: any[] }>(url).subscribe({
      next: (res: any) => {
        if (res && res.slots) {
          this.timeSlots = res.slots.map((s:any) => ({
            time: s.time,
            disabled: s.isBooked
          }));
          this.cdr.detectChanges(); // Force push view updates
        }
      },
      error: (err: any) => {
        console.error('Error fetching slots for modification:', err);
        this.timeSlots = [];
        this.cdr.detectChanges();
      }
    });
  }

  /* ---------- UPDATE / RESCHEDULE ---------- */
  updateAppointment(): void {
    if (!this.appointment || !this.appointment.appointmentId) return;

    // ✅ FIX 3: Passed 2 arguments (id, payload) aur response channel ko subscribe kiya
    this.appointmentService.update(this.appointment.appointmentId, this.appointment).subscribe({
      next: (res: any) => {
        console.log('Appointment updated successfully in database:', res);
        this.router.navigate(['/patient']);
      },
      error: (err: any) => console.error('Update operation failed:', err)
    });
  }

  /* ---------- CANCEL ---------- */
  cancelAppointment(): void {
    if (!this.appointment || !this.appointment.appointmentId) return;

    // Direct update endpoint par status object update push mari
    const cancelPayload = { status: 'Cancelled' };

    this.appointmentService.update(this.appointment.appointmentId, cancelPayload).subscribe({
      next: (res: any) => {
        console.log('Appointment cancelled successfully:', res);
        this.router.navigate(['/patient']);
      },
      error: (err: any) => console.error('Cancellation failed:', err)
    });
  }
}