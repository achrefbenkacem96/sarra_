import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PerformanceService } from '../../../services/performance.service';
import { AgenceService } from '../../../services/agence.service';
import { Performance } from '../../../models/performance.model';
import { Agence } from '../../../models/agences.model';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { PerformanceFormDialogComponent } from './performance-form-dialog/performance-form-dialog.component';

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss'],
  providers: [DatePipe]
})
export class PerformancesComponent implements OnInit {
  performances: Performance[] = [];
  agences: Agence[] = [];
  filteredPerformances: Performance[] = [];
  
  // For MatTable
  displayedColumns: string[] = [
    'id', 'agence', 'chiffreAffaire', 'nombreContrats', 
    'dateDebut', 'dateFin', 'actions'
  ];
  dataSource = new MatTableDataSource<Performance>();
  
  // Filters
  agenceFilter = new FormControl('');
  dateDebutFilter = new FormControl('');
  dateFinFilter = new FormControl('');
  
  isLoading = false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private performanceService: PerformanceService,
    private agenceService: AgenceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAgences();
    this.loadPerformances();
    
    // Set up filter subscriptions
    this.agenceFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateDebutFilter.valueChanges.subscribe(() => this.applyFilters());
    this.dateFinFilter.valueChanges.subscribe(() => this.applyFilters());
  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPerformances(): void {
    this.isLoading = true;
    this.performanceService.getAllPerformances().subscribe({
      next: (data: Performance[]) => {
        this.performances = data;
        this.filteredPerformances = [...data];
        this.dataSource.data = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading performances', error);
        this.snackBar.open('Erreur lors du chargement des performances', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
  
  loadAgences(): void {
    this.agenceService.getAllAgences().subscribe({
      next: (data: Agence[]) => {
        this.agences = data;
      },
      error: (error) => {
        console.error('Error loading agencies', error);
      }
    });
  }
  
  openPerformanceDialog(performance?: Performance): void {
    const dialogRef = this.dialog.open(PerformanceFormDialogComponent, {
      width: '700px',
      data: {
        performance: performance || null,
        isEditMode: !!performance,
        agences: this.agences
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (performance) {
          // Update existing performance
          this.updatePerformance(performance.idPerformance, result);
        } else {
          // Create new performance
          this.createPerformance(result);
        }
      }
    });
  }

  createPerformance(performanceData: any): void {
    this.isLoading = true;
    const formValue = {
      ...performanceData,
      dateDebut: new Date(performanceData.dateDebut).toISOString().slice(0, 10),
      dateFin: new Date(performanceData.dateFin).toISOString().slice(0, 10)
    };
    this.performanceService.createPerformance(formValue).subscribe({
      next: () => {
        this.loadPerformances();
        this.snackBar.open('Performance créée avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error creating performance', error);
        this.snackBar.open('Erreur lors de la création de la performance', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  updatePerformance(id: number, performanceData: any): void {
    this.isLoading = true;
    const formValue = {
      ...performanceData,
      dateDebut: new Date(performanceData.dateDebut).toISOString().slice(0, 10),
      dateFin: new Date(performanceData.dateFin).toISOString().slice(0, 10),
      agence: performanceData.agence?.idAgence
    };
    console.log(formValue);
    this.performanceService.updatePerformance(id, formValue).subscribe({
      next: () => {
        this.loadPerformances();
        this.snackBar.open('Performance mise à jour avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating performance', error);
        this.snackBar.open('Erreur lors de la mise à jour de la performance', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  deletePerformance(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette performance ?')) {
      this.isLoading = true;
      this.performanceService.deletePerformance(id).subscribe({
        next: () => {
          this.loadPerformances();
          this.snackBar.open('Performance supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting performance', error);
          this.snackBar.open('Erreur lors de la suppression de la performance', 'Fermer', {
            duration: 3000
          });
          this.isLoading = false;
        }
      });
    }
  }
  
  applyFilters(): void {
    let filtered = [...this.performances];
    
    // Apply agence filter
    const agenceId = this.agenceFilter.value;
    if (agenceId) {
      filtered = filtered.filter(p => p.agence.idAgence === Number(agenceId));
    }
    
    // Apply date debut filter
    const dateDebut = this.dateDebutFilter.value;
    if (dateDebut) {
      const filterDate = new Date(dateDebut);
      filtered = filtered.filter(p => {
        const performanceDate = new Date(p.dateDebut) ;
        return performanceDate >= filterDate;
      });
    }
    
    // Apply date fin filter
    const dateFin = this.dateFinFilter.value;
    if (dateFin) {
      const filterDate = new Date(dateFin);
      filtered = filtered.filter(p => {
        const performanceDate = new Date(p.dateFin);
        return performanceDate <= filterDate;
      });
    }
    
    this.filteredPerformances = filtered;
    this.dataSource.data = filtered;
  }
  
  clearFilters(): void {
    this.agenceFilter.setValue('');
    this.dateDebutFilter.setValue('');
    this.dateFinFilter.setValue('');
    this.filteredPerformances = [...this.performances];
    this.dataSource.data = this.performances;
  }
  
  // Make this public so it can be used in the template
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
  
  exportToExcel(): void {
    this.isLoading = true;
    this.performanceService.exportPerformancesToExcel().subscribe({
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
      error: (error) => {
        console.error('Error exporting to Excel', error);
        this.snackBar.open('Erreur lors de l\'export Excel', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  exportToPdf(): void {
    this.isLoading = true;
    this.performanceService.exportPerformancesToPdf().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performances_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Export PDF réussi', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error exporting to PDF', error);
        this.snackBar.open('Erreur lors de l\'export PDF', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
  
  generateStatistics(): void {
    this.isLoading = true;
    this.performanceService.generateStatistics().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistiques_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Génération de statistiques réussie', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error generating statistics', error);
        this.snackBar.open('Erreur lors de la génération des statistiques', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
} 