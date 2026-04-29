import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { DoctorService } from '../../services/doctor.service';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

import { Doctor } from '../../models/doctor.model';
import { Appointment } from '../../models/appointment.model';
import { AVAILABILITY } from '../../mockdata/availability.mock';
import { RouterModule } from '@angular/router';

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

  /* ---------- FORM REFERENCE ---------- */
  @ViewChild('apptForm') apptForm!: NgForm;

  /* ---------- UI STATE ---------- */
  booked = false;

  /* ---------- FORM MODEL ---------- */
  appointment = {
    doctorId: '',
    date: '',
    time: '',
    mode: '',
    reason: ''
  };

  /* ---------- DATA ---------- */
  doctors: Doctor[] = [];
  availableDates: string[] = [];
  timeSlots: TimeSlot[] = [];

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  /* ---------- LIFECYCLE ---------- */
  ngOnInit(): void {
    this.doctors = this.doctorService.getAllDoctors();
    this.generateNextFiveDays();
  }

  /* ---------- DATE LOGIC ---------- */
  private generateNextFiveDays(): void {
    const today = new Date();
    this.availableDates = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      this.availableDates.push(d.toISOString().split('T')[0]);
    }
  }

  onDateChange(): void {
    this.appointment.time = '';
    this.generateTimeSlots();
  }

  /* ---------- TIME SLOT LOGIC ---------- */
  private generateTimeSlots(): void {
    this.timeSlots = [];

    const doctorId = Number(this.appointment.doctorId);
    if (!doctorId || !this.appointment.date) return;

    const availability = AVAILABILITY.find(
      a => a.doctorId === doctorId
    );

    if (!availability) return;

const slotsForDate = availability.slot.filter(
  s => s.date.split('T')[0] === this.appointment.date
);

    this.timeSlots = slotsForDate.map(s => ({
      time: s.time.substring(11, 16), // HH:mm
      disabled: !s.isAvailable
    }));
  }

  /* ---------- SUBMIT ---------- */
  submitAppointment(): void {

    // ✅ THIS IS THE IMPORTANT UPDATE
    // submit click pe sab fields touched ho jaayenge
    if (this.apptForm.invalid) {
      this.apptForm.form.markAllAsTouched();
      return;
    }

    const patient = this.authService.getLoggedInPatient();
    if (!patient) return;

    const newAppointment: Appointment = {
      appoitmentId: Date.now(),
      doctor: Number(this.appointment.doctorId),
      patientId: patient.patientId,
      date: this.appointment.date,
      time: this.appointment.time,
      status: 'Scheduled'
    };

    this.appointmentService.book(newAppointment);

    // frontend simulation: slot unavailable
    const availability = AVAILABILITY.find(
      a => a.doctorId === newAppointment.doctor
    );

    const slot = availability?.slot.find(
      s =>
        s.date === newAppointment.date &&
        s.time.includes(newAppointment.time)
    );

    if (slot) {
      slot.isAvailable = false;
    }

    this.booked = true;

    console.log(' Appointment booked:', newAppointment);
  }
}