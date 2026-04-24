import { Component } from '@angular/core';
import { availability } from '../../availability';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-availability-slot',
  imports: [CommonModule,FormsModule],
  templateUrl: './doctor-availability-slot.html',
  styleUrl: './doctor-availability-slot.css',
})

export class DoctorAvailabilitySlot {
    id = 2;
    allData = availability;
  
  selectedDate: string = ""; // Bound to <input type="date">
  
  filteredSlots: any[] = []; // Slots for the selected day
  doctorRecord: any;
  date!:Date;
  endDate!:Date;

  ngOnInit() {
    this.doctorRecord = this.allData.find(d => d.doctorId === this.id);
      this.date = new Date();
      this.endDate = new Date(this.date);
      this.endDate.setDate(this.date.getDate() + 6);

  }

  // Triggered when date input changes
  onDateChange() {
    if (!this.selectedDate) return;

    this.filteredSlots = this.doctorRecord.slots.filter((s: any) => 
      s.time.startsWith(this.selectedDate)
    );
  }

  updateAvailability() {
    alert("Availability Updated Successfully!");
    console.log("Updated Data:", this.doctorRecord);
    this.onDateChange();
  }
}
