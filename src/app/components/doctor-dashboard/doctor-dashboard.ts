import { Component, inject } from '@angular/core';
import { DOCTORS } from '../../mockdata/doctors.mock';

import { CommonModule } from '@angular/common';
import { PastConsultation } from '../past-consultation/past-consultation';
import { DoctorAvailabilitySlot } from '../doctor-availability-slot/doctor-availability-slot';
import { AVAILABILITY } from '../../mockdata/availability.mock';
import { DoctorService } from '../../services/doctor.service';
import { PATIENTS } from '../../mockdata/patient.mock';



@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule,PastConsultation,DoctorAvailabilitySlot],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})


export class DoctorDashboard {
    //Services
    docService=inject(DoctorService);
    
    slot = AVAILABILITY;
    flag=1;


    //docList2=DOCTORS;
    
    
    patientList2=PATIENTS;


    doctorId=1;

    patientList=this.patientList2.filter(e=>e.doctorAssigned.find(x=> x=== this.doctorId));

    


    url:string="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*";
    Name:string="Sahil Fulmali";
    degree:string[]=["MBBS","MD"];
    experience:number=10;
    department:string="Cardiologist";
    

    ngOnInit(){
      console.log(DOCTORS)
    }

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
      this.docService.deleteAppointment(this.doctorId);
    }


}
