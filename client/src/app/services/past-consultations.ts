import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CONSULTATIONS } from '../mockdata/consultations.mock';
import { DoctorService } from './doctor.service';
import { Doctor } from '../models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class PastConsultations {

  constructor(private doctorService: DoctorService) {}


  listAll(): Observable<any[]> {

    const doctors: Doctor[] = this.doctorService.getAllDoctors();
    const allRecords: any[] = [];

    CONSULTATIONS.forEach(patientGroup => {
      patientGroup.consultations.forEach(c => {

        const doctor = doctors.find(d => d.id === c.doctorId);

        allRecords.push({
          consultationId: c.consultationID,
          appointmentId: c.appointmentId,
          patientName: `Patient ${patientGroup.patientID}`,
          doctorId: c.doctorId,
          doctorName: doctor ? doctor.name : 'Unknown Doctor',
          date: c.date,                      
          prescription: c.prescriptions,
          notes: c.notes
        });

      });
    });

    return of(allRecords);
  }

  /* 2. SINGLE PRESCRIPTION FOR PDF VIEW- */
  getPrescriptionById(consultationId: string | number): Observable<any> {

    const doctors: Doctor[] = this.doctorService.getAllDoctors();

    for (const patientGroup of CONSULTATIONS) {
      const found = patientGroup.consultations.find(
        c => String(c.consultationID) === String(consultationId)
      );

      if (found) {
        const doctor = doctors.find(d => d.id === found.doctorId);

        const formattedRecord = {
          consultationId: found.consultationID,
          date: found.date,
          patient: {
            name: `Patient ${patientGroup.patientID}`,
            age: 30,
            phone: '(123) 456-7890',
            email: `patient${patientGroup.patientID}@example.com`,
            gender: 'Not Specified',
            address: '123 Health Street\nChennai, TN',
            allergies: 'None recorded',
            condition: found.notes
          },
          medications: found.prescriptions,
          physician: {
            name: doctor ? doctor.name : 'Unknown Doctor'
          }
        };

        return of(formattedRecord);
      }
    }

    console.warn(`Prescription with ID ${consultationId} not found.`);
    return of(null);
  }
}