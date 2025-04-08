import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PerformanceService } from '../../../../services/performance.service';
import { Agence } from '../../../../models/agences.model';
import { AgencePerformance } from '../../../../models/agence-performance.model';
import { Performance } from '../../../../models/performance.model';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-agence-details',
  templateUrl: './agence-details.component.html',
  styleUrls: ['./agence-details.component.scss'],
  providers: [DatePipe]
})
export class AgenceDetailsComponent implements OnInit {
  performances: Performance[] = [];
  agencePerformance: AgencePerformance | null = null;
  
  startDate = new FormControl(this.getThreeMonthsAgo());
  endDate = new FormControl(new Date());
  
  isLoading = false;
  
  constructor(
    public dialogRef: MatDialogRef<AgenceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agence: Agence },
    private performanceService: PerformanceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadPerformances();
    this.loadAgencePerformance();
  }
  
  loadPerformances(): void {
    this.isLoading = true;
    this.performanceService.getPerformancesByAgence(this.data.agence.idAgence).subscribe({
      next: (data) => {
        this.performances = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading performances', error);
        this.isLoading = false;
      }
    });
  }
  
  loadAgencePerformance(): void {
    if (!this.startDate.value || !this.endDate.value) {
      return;
    }
    
    this.isLoading = true;
    
    const startDateString = this.formatDate(this.startDate.value);
    const endDateString = this.formatDate(this.endDate.value);
    
    this.performanceService.getAgencePerformance(
      this.data.agence.idAgence,
      startDateString,
      endDateString
    ).subscribe({
      next: (data) => {
        this.agencePerformance = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading agency performance', error);
        this.isLoading = false;
      }
    });
  }
  
  onDateChange(): void {
    this.loadAgencePerformance();
  }
  
  closeDialog(): void {
    this.dialogRef.close();
  }
  
  private getThreeMonthsAgo(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date;
  }
  
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
} 