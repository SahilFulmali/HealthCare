import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PastConsultation } from '../past-consultation/past-consultation';
import { DoctorAvailabilitySlot } from '../doctor-availability-slot/doctor-availability-slot';
import { DoctorService } from '../../services/doctor.service';
import { Appointment } from '../../models/appointment.model';
import { Doctor } from '../../models/doctor.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule, PastConsultation, DoctorAvailabilitySlot],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})

export class DoctorDashboard {
  docService = inject(DoctorService);

  DoctorInfo$!: Observable<Doctor>;
  upcomingAppointments$!: Observable<Appointment[]>;

  flag = 2;
  selectedConsultation: string | null = null;

  ngOnInit(){
    this.DoctorInfo$ = this.docService.getDoctor();
    this.upcomingAppointments$ = this.docService.getUpcomingAppointments();
  }

  toggleConsultation(appointmentId: string) {
    this.selectedConsultation =
      this.selectedConsultation === appointmentId ? null : appointmentId;
  }

  viewUpcoming() {
    this.flag = 1;
  }

  viewPast() {
    this.flag = 2;
  }

  editAvailability() {
    this.flag = 3;
  }

  cancelAppointment(appointmentId: string): void {
    this.docService.deleteAppointment(appointmentId).subscribe({
      next: () => {
        this.upcomingAppointments$ = this.docService.getUpcomingAppointments();
      },
      error: (err) => {
        console.error('Error deleting appointment', err);
      },
    });
  }
  
}
