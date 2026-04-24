import { Component } from '@angular/core';

@Component({
  selector: 'app-past-consultation',
  imports: [],
  templateUrl: './past-consultation.html',
  styleUrl: './past-consultation.css',
})
export class PastConsultation {
    date = new Date();
    consultationList!:any;

    
}
