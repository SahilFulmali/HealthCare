import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

import { PastConsultations } from '../../../services/past-consultations';
import { DoctorService } from '../../../services/doctor.service';
import { Doctor } from '../../../models/doctor.model';

@Component({
  selector: 'app-past-consultation-list',
  standalone: true,
  imports: [CommonModule, AsyncPipe, DatePipe],
  templateUrl: './past-consultation-list.html',
  styleUrl: './past-consultation-list.css',
})
export class PastConsultationList implements OnInit {

  allList$!: Observable<any[]>;

  private pastService = inject(PastConsultations);
  private doctorService = inject(DoctorService);
  private router = inject(Router);

  hiddenDownloadData: any = null;
  isDownloading = false;

  /** doctorId -> doctorName map */
  private doctorMap = new Map<number, string>();

  ngOnInit(): void {

    /** Prepare doctorId -> doctorName mapping */
    const doctors: Doctor[] = this.doctorService.getAllDoctors();
    doctors.forEach(doc => {
      this.doctorMap.set(doc.doctorId, doc.name);
    });

    /** Load consultations and map doctorId to doctorName */
 this.allList$ = this.pastService.listAll().pipe(
  map(consultations =>
    consultations.map(record => ({
      ...record,
      doctorName:
        this.doctorMap.get(Number(record.doctorId)) || 'Unknown Doctor'
    }))
  )
);
    
  }

  viewPrescription(id: string | number): void {
    if (!id) return;

    this.router.navigate(['/view-prescription'], {
      queryParams: { consultationId: id }
    });
  }

  /** Native Silent HTML Download */
  downloadPrescription(id: string | number): void {
    if (this.isDownloading) return;

    this.isDownloading = true;

    this.pastService.getPrescriptionById(id).subscribe(data => {
      if (!data) {
        this.isDownloading = false;
        return;
      }

      this.hiddenDownloadData = data;

      setTimeout(() => {
        const element = document.getElementById('hidden-pdf-template');
        if (!element) return;

        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Prescription #${id}</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 2rem; background: #fff; }
              .pdf-download-container { max-width: 800px; margin: 0 auto; }
              .main-title { color: #791b40; text-align: center; font-size: 26px; font-weight: 700; }
              .sub-title { color: #791b40; text-align: center; font-size: 20px; margin-bottom: 15px; }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
          </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `Prescription_${id}.html`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);

        this.hiddenDownloadData = null;
        this.isDownloading = false;
      }, 200);
    });
  }
}
