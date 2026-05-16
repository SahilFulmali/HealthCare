import { inject, Injectable } from '@angular/core';
import { AppointmentService } from './appointment.service';
import { AuthService } from './auth.service';
import { Appointment } from '../models/appointment.model';
import { Observable, map, of } from 'rxjs'; // 👈 RxJS operators imports kiye

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // Angular 17+ Modern Pattern Injection
  private appointmentService = inject(AppointmentService);
  private authService = inject(AuthService);

  constructor() {}

  // Patient info for dashboard header (Same as before)
  getPatientContext() {
    return this.authService.getLoggedInPatient();
  }

  // ✅ FIX 1: Counts for summary cards (Handled Async Observable Array Stream)
  getAppointmentSummary(): Observable<{ total: number; upcoming: number }> {
    const patient = this.getPatientContext();
    if (!patient) return of({ total: 0, upcoming: 0 }); // Agar patient nahi hai toh safely empty object return karo

    // Pure hospital ke bajay strictly logged-in patient ki appointments fetch karega via database
    return this.appointmentService.getByPatientId(patient.patientId).pipe(
      map((appointments: Appointment[]) => {
        return {
          total: appointments.length,
          upcoming: appointments.filter((a: any) => a.status === 'Scheduled').length
        };
      })
    );
  }

  // ✅ FIX 2: Nearest upcoming scheduled appointment (Handled Stream Mapping & Strict Type Casting)
  getUpcomingAppointment(): Observable<Appointment | null> {
    const patient = this.getPatientContext();
    if (!patient) return of(null);

    return this.appointmentService.getByPatientId(patient.patientId).pipe(
      map((appointments: Appointment[]) => {
        const upcoming = appointments
          .filter((a: any) => a.status === 'Scheduled')
          .sort((a: any, b: any) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });

        return upcoming.length ? upcoming[0] : null;
      })
    );
  }
}