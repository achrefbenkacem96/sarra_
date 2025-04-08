import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerformanceService } from '../../../../services/performance.service';
import { AgencePerformance } from '../../../../models/agence-performance.model';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics-dashboard',
  templateUrl: './statistics-dashboard.component.html',
  styleUrls: ['./statistics-dashboard.component.scss'],
  providers: [DatePipe]
})
export class StatisticsDashboardComponent implements OnInit {
  // Date range controls
  startDate = new FormControl(this.getFirstDayOfYear());
  endDate = new FormControl(new Date());
  
  // Chart data
  topRevenueAgences: AgencePerformance[] = [];
  topContractsAgences: AgencePerformance[] = [];
  
  // Charts
  revenueChart: Chart | null = null;
  contractsChart: Chart | null = null;
  
  isLoading = false;
  
  constructor(
    private performanceService: PerformanceService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData(): void {
    if (!this.startDate.value || !this.endDate.value) {
      return;
    }
    
    this.isLoading = true;
    
    const startDateString = this.formatDate(this.startDate.value);
    const endDateString = this.formatDate(this.endDate.value);
    
    // Load top agencies by revenue
    this.performanceService.getTopAgencesByRevenue(5, startDateString, endDateString)
      .subscribe({
        next: (data) => {
          this.topRevenueAgences = data;
          this.createRevenueChart();
        },
        error: (error) => {
          console.error('Error loading top agencies by revenue', error);
          this.snackBar.open('Erreur lors du chargement des données de chiffre d\'affaires', 'Fermer', { 
            duration: 3000 
          });
        }
      });
    
    // Load top agencies by contracts
    this.performanceService.getTopAgencesByContracts(5, startDateString, endDateString)
      .subscribe({
        next: (data) => {
          this.topContractsAgences = data;
          this.createContractsChart();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading top agencies by contracts', error);
          this.snackBar.open('Erreur lors du chargement des données de contrats', 'Fermer', { 
            duration: 3000 
          });
          this.isLoading = false;
        }
      });
  }
  
  createRevenueChart(): void {
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    
    const canvas = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const labels = this.topRevenueAgences.map(a => a.nomAgence);
    const data = this.topRevenueAgences.map(a => a.chiffreAffaireTotal);
    
    this.revenueChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chiffre d\'affaires (€)',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 5 des Agences par Chiffre d\'Affaires',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value} €`
            }
          }
        }
      }
    });
  }
  
  createContractsChart(): void {
    if (this.contractsChart) {
      this.contractsChart.destroy();
    }
    
    const canvas = document.getElementById('contractsChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const labels = this.topContractsAgences.map(a => a.nomAgence);
    const data = this.topContractsAgences.map(a => a.nombreContratsTotal);
    
    this.contractsChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de contrats',
          data: data,
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top 5 des Agences par Nombre de Contrats',
            font: {
              size: 16
            }
          },
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}`
            }
          }
        }
      }
    });
  }
  
  onDateChange(): void {
    this.loadData();
  }
  
  exportToPdf(): void {
    if (!this.startDate.value || !this.endDate.value) {
      this.snackBar.open('Veuillez sélectionner une période', 'Fermer', { duration: 3000 });
      return;
    }
    
    this.isLoading = true;
    
    const startDateString = this.formatDate(this.startDate.value);
    const endDateString = this.formatDate(this.endDate.value);
    
    this.performanceService.exportStatisticsToPdf(5, startDateString, endDateString)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `statistiques_agences_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.snackBar.open('Export PDF réussi', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error exporting to PDF', error);
          this.snackBar.open('Erreur lors de l\'export PDF', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }
  
  exportToExcel(): void {
    this.isLoading = true;
    
    this.performanceService.exportToExcel()
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `performances_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.xlsx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.snackBar.open('Export Excel réussi', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error exporting to Excel', error);
          this.snackBar.open('Erreur lors de l\'export Excel', 'Fermer', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }
  
  private getFirstDayOfYear(): Date {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    return date;
  }
  
  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }
} 