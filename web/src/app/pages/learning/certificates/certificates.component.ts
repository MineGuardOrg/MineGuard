import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CertificatesService } from './certificates.service';

interface Certificate {
  id: number;
  personName: string;
  courseName: string;
  issueDate: string;
  imgSrc: string;
}

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatChipsModule,
    TablerIconsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  providers: [DatePipe],
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss'],
})
export class AppCertificatesComponent implements OnInit {
  certificates: Certificate[] = [];

  @ViewChild('certificateDialog') certificateDialog!: TemplateRef<any>;
  @ViewChild('certificateContent') certificateContent!: ElementRef;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private certificatesService: CertificatesService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadCertificatesFromApi();
  }

  loadCertificatesFromApi(): void {
    this.certificatesService.getCertificatesByUser().subscribe({
      next: (data) => {
        this.certificates = data.map((cert: any) => ({
          id: cert.id,
          personName: cert.userName,
          courseName: cert.courseName,
          issueDate: this.datePipe.transform(cert.emisionDate, 'dd MMMM yyyy', 'es') || '',
          imgSrc: '/assets/images/courses/certificate.png',
        }));
        console.log('Certificados recibidos:', data);
      },
      error: (err) => {
        console.error('Error al cargar certificados:', err);
      },
    });
  }

  openDialog(cert: Certificate): void {
    const dialogRef = this.dialog.open(this.certificateDialog, {
      data: cert,
      width: '800px',
    });

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => this.downloadPDF(cert), 500);
    });
  }

  async downloadPDF(cert: Certificate): Promise<void> {
    const element = this.certificateContent.nativeElement;
    const images: NodeListOf<HTMLImageElement> = element.querySelectorAll('img');
    const imageLoadPromises: Promise<void>[] = [];

    images.forEach((image) => {
      if (!image.complete) {
        imageLoadPromises.push(
          new Promise<void>((resolve) => {
            image.onload = () => resolve();
            image.onerror = () => resolve();
          })
        );
      }
    });

    await Promise.all(imageLoadPromises);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    pdf.save(`certificado-${cert.personName}.pdf`);
  }

  viewCertificate(id: number): void {
    this.router.navigate(['/learning/certificates/details', id]);
  }
}
