import { Injectable } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { AuthService } from './auth.service';
import { Appointment } from '../models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService
  ) {}

  // Patient info for dashboard header
  getPatientContext() {
    return this.authService.getLoggedInPatient();
  }

  // Counts for summary cards
  getAppointmentSummary() {
    const appointments = this.appointmentService.getAll();

    return {
      total: appointments.length,
      upcoming: appointments.filter(a => a.status === 'Scheduled').length
    };
  }

  // Nearest upcoming scheduled appointment (by date only)
  getUpcomingAppointment(): Appointment | null {
    const upcoming = this.appointmentService
      .getAll()
      .filter(a => a.status === 'Scheduled')
      .sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

    return upcoming.length ? upcoming[0] : null;
  }
}