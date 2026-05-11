import { Injectable } from '@angular/core';
import { Appointment } from '../models/appointment.model';
import { APPOINTMENTS } from '../mockdata/appointments.mock';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor() {}

  // READ: Get all appointments
  getAll(): Appointment[] {
    return [...APPOINTMENTS];
  }

  // READ: Get appointment by ID
  getById(appoitmentId: number): Appointment | undefined {
    return APPOINTMENTS.find(
      a => a.appoitmentId === appoitmentId
    );
  }

  // READ: Get appointments for a patient
  getByPatientId(patientId: number): Appointment[] {
    return APPOINTMENTS.filter(
      a => a.patientId === patientId
    );
  }

  // READ: Get appointments for a doctor
  getByDoctorId(doctorId: number): Appointment[] {
    return APPOINTMENTS.filter(
      a => a.doctor === doctorId
    );
  }

  // CREATE: Book new appointment (dummy)
  book(appointment: Appointment): void {
    const newAppointment: Appointment = {
      ...appointment,
      appoitmentId: Date.now(),
      status: 'Scheduled'
    };

    APPOINTMENTS.push(newAppointment);
  }

  // UPDATE: Update appointment status/date
  update(updated: Appointment): void {
    const index = APPOINTMENTS.findIndex(
      a => a.appoitmentId === updated.appoitmentId
    );

    if (index !== -1) {
      APPOINTMENTS[index] = updated;
    }
  }

  // DELETE: Cancel appointment
  cancel(appoitmentId: number): void {
    const index = APPOINTMENTS.findIndex(
      a => a.appoitmentId === appoitmentId
    );

    if (index !== -1) {
      APPOINTMENTS.splice(index, 1);
    }
  }
}