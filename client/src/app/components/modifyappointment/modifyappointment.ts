import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';

import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';
import { AVAILABILITY } from '../../mockdata/availability.mock';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('appointmentId'));
    const appt = this.appointmentService.getById(id);

    if (!appt) {
      this.router.navigate(['/patient']);
      return;
    }

    this.appointment = { ...appt };
    this.doctor = this.doctorService.getDoctorById(appt.doctor)!;

    this.generateNextFiveDays();
    this.generateTimeSlots();
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
  }

  onDateChange(): void {
    this.appointment.time = '';
    this.generateTimeSlots();
  }

  /* ---------- TIME SLOTS ---------- */
  private generateTimeSlots(): void {
    this.timeSlots = [];

    const availability = AVAILABILITY.find(
      a => a.doctorId === this.appointment.doctor
    );

    if (!availability) return;

    const slotsForDate = availability.slot.filter(
      s => s.date.split('T')[0] === this.appointment.date
    );

    this.timeSlots = slotsForDate.map(s => ({
      time: s.time.substring(11, 16),
      disabled: !s.isAvailable
    }));
  }

  /* ---------- UPDATE ---------- */
  updateAppointment(): void {
    if (!this.appointment) return;

    this.appointmentService.update(this.appointment);
    this.router.navigate(['/patient']);
  }

  /* ---------- CANCEL ---------- */
  cancelAppointment(): void {
    this.appointment.status = 'Cancelled';
    this.appointmentService.update(this.appointment);
    this.router.navigate(['/patient']);
  }
}