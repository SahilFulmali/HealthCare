import { Component } from '@angular/core';
import { docList } from '../../docList';
import { patientList } from '../../patientLlist';
import { CommonModule } from '@angular/common';
import { PastConsultation } from '../past-consultation/past-consultation';
import { DoctorAvailabilitySlot } from '../doctor-availability-slot/doctor-availability-slot';
import { availability } from '../../availability';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule,PastConsultation,DoctorAvailabilitySlot],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard {
    docList2=docList;
    slot = availability;
    patientList2=patientList;


    doctorId=1;
    patientList=this.patientList2.filter(e=>e.doctorAssigned.find(x=> x===this.doctorId));

    flag=1;


    url:string="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=640:*";
    Name:string="Sahil Fulmali";
    degree:string[]=["MBBS","MD"];
    experience:number=10;
    department:string="Cardiologist";
    

    ngOnInit(){

    }

    toggleButton() {
      this.flag = (this.flag === 1) ? 2 : 1;
    }

    editAvailability() {
      this.flag = 3;
    }


}
