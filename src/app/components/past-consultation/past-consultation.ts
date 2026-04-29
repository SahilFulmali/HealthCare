import { Component, OnInit } from '@angular/core';
import { APPOINTMENTS } from '../../mockdata/appointments.mock';
import { PATIENTS } from '../../mockdata/patient.mock';

import { CONSULTATIONS } from '../../mockdata/consultations.mock'; // <-- import consultations data
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-past-consultation',
  imports: [CommonModule],
  templateUrl: './past-consultation.html',
  styleUrls: ['./past-consultation.css']
})
export class PastConsultation implements OnInit {
  date = new Date();
  pastConsultationArray: any[] = [];
  patientList = PATIENTS;
  doctorId = 1; 

  // 🔑 new state for modal
  selectedConsultation: any | null = null;

  ngOnInit(): void {
    const today = new Date();
    
    
    this.pastConsultationArray = APPOINTMENTS
      .filter(c => {
        const appointmentDate = new Date(c.date);
        return appointmentDate < today && c.status === 'Completed' && c.doctor === this.doctorId;
      })
      .map(c => {
        const patient = this.patientList.find(p => p.patientId === c.patientId);
        return {
          ...c,
          patientName: patient ? patient.name : 'Unknown'
        };
      });
      console.log(this.pastConsultationArray)
    console.log(`Past consultations for doctor ${this.doctorId}:`, this.pastConsultationArray);
  }

  //  open modal with consultation details
  expandPatientInfo(patientId: number, consultationId: number) {
    console.log(":andar 1")
    const patientConsultation = CONSULTATIONS.find(p => p.patientID === patientId);
    if (!patientConsultation) return;

    const consultation = patientConsultation.consultations.find(c => c.doctorId === this.doctorId);
    if (consultation) {
      this.selectedConsultation = { patientId, ...consultation };
    }
  }

  // 🔑 close modal
  closeModal() {
    this.selectedConsultation = null;
  }
}
