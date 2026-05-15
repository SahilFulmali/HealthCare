import { Component, inject } from '@angular/core';
import { DOCTORS } from '../../mockdata/doctors.mock';

import { CommonModule } from '@angular/common';
import { PastConsultation } from '../past-consultation/past-consultation';
import { DoctorAvailabilitySlot } from '../doctor-availability-slot/doctor-availability-slot';
import { AVAILABILITY } from '../../mockdata/availability.mock';
import { APPOINTMENTS } from '../../mockdata/appointments.mock';
import { DoctorService } from '../../services/doctor.service';
import { PATIENTS } from '../../mockdata/patient.mock';

import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule,PastConsultation,DoctorAvailabilitySlot],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})


export class DoctorDashboard {
    //Services
    docService=inject(DoctorService);
    

    DoctorInfo:string=this.viewDoctorInfo();

    viewDoctorInfo():string{
     return "sahil";
    }
    slot = AVAILABILITY;
    flag=2;

    upcomingAppointmentArray:any[]=[];
   
    doctorId=1;
    url:string="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*";
    Name:string="Sahil Fulmali";
    degree:string[]=["MBBS","MD"];
    experience:number=10;
    department:string="Cardiologist";

    selectedConsultation: number | null = null;

    ngOnInit(){

      const today=new Date();
      

      this.upcomingAppointmentArray = APPOINTMENTS.filter((c) => {
              const appointmentDate = new Date(c.date);
              return appointmentDate > today  && c.doctor === this.doctorId;}
            ).map(c => {
                    const patient = PATIENTS.find(p => p.patientId === c.patientId);
                    return {
                      ...c,
                      patientName: patient ? patient.name : 'Unknown',
                       medicalHistory: patient? patient.medicalHistory : [] ,
                        allergy: patient? patient.allergy : [] ,
                    };
      });

      console.log(this.upcomingAppointmentArray)

    }

  
  toggleConsultation(appointmentId: number) {
    this.selectedConsultation =
    this.selectedConsultation === appointmentId ? null : appointmentId;
  }

    // moreView() {
    //   this.selectedConsultation = !this.selectedConsultation;
    // }   

    // closeView() {
    //  this.selectedConsultation = false;
    // }


    viewUpcoming() {
      this.flag = 1;
    }
    viewPast(){
      this.flag=2;
    }
    editAvailability() {
      this.flag = 3;
    }

    cancelAppointment(id:number){
      confirm("Do you want to delete Appointment?")
      this.docService.deleteAppointment(this.doctorId);
    }

}
