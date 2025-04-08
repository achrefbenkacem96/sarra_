// src/app/pages/admin/agences/agences.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AgenceService } from '../../../services/agence.service';
import { PerformanceService } from '../../../services/performance.service';
import { Agence } from '../../../models/agences.model';
import { AgenceDetailsComponent } from './agence-details/agence-details.component';
import { AgenceFormDialogComponent } from './agence-form-dialog/agence-form-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-agences',
  templateUrl: './agences.component.html',
  styleUrls: ['./agences.component.scss'],
  providers: [DatePipe]
})
export class AgencesComponent implements OnInit {
  agences: Agence[] = [];
  dataSource = new MatTableDataSource<Agence>();
  displayedColumns: string[] = [
    'nom', 
    'ville', 
    'adresse', 
    'telephone', 
    'email', 
    'responsable', 
    'actions'
  ];
  
  // Search and filter controls
  searchControl = new FormControl('');
  villeControl = new FormControl('');
  villes: string[] = [];
  
  isLoading = false;

  constructor(
    private agenceService: AgenceService,
    private performanceService: PerformanceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAgences();
    this.loadCities();
    
    // Set up search with debounce
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.loadAgences();
      });
    
    // Set up ville filter
    this.villeControl.valueChanges.subscribe(() => {
      this.loadAgences();
    });
  }

  loadAgences(): void {
    this.isLoading = true;
    const search = this.searchControl.value;
    const ville = this.villeControl.value;
    if (search !== null && ville !== null) {
    this.agenceService.getAllAgences(search, ville).subscribe({
      next: (data: Agence[]) => {
        this.agences = data;
        this.dataSource.data = data; 
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading agencies', error);
        this.snackBar.open('Erreur lors du chargement des agences', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
  }
  
  loadCities(): void {
    this.agenceService.getAllCities().subscribe({
      next: (cities: string[]) => {
        this.villes = cities;
      },
      error: (error) => {
        console.error('Error loading cities', error);
      }
    });
  }

  openAgenceDialog(agence?: Agence): void {
    const dialogRef = this.dialog.open(AgenceFormDialogComponent, {
      width: '700px',
      data: {
        agence: agence || null,
        isEditMode: !!agence
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (agence) {
          // Update existing agency
          this.updateAgence(agence.idAgence, result);
        } else {
          // Create new agency
          this.createAgence(result);
        }
      }
    });
  }

  createAgence(agenceData: any): void {
    this.isLoading = true;
    this.agenceService.createAgence(agenceData).subscribe({
      next: () => {
        this.loadAgences();
        this.snackBar.open('Agence créée avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error creating agency', error);
        this.snackBar.open('Erreur lors de la création de l\'agence', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  updateAgence(id: number, agenceData: any): void {
    this.isLoading = true;
    this.agenceService.updateAgence(id, agenceData).subscribe({
      next: () => {
        this.loadAgences();
        this.snackBar.open('Agence mise à jour avec succès', 'Fermer', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('Error updating agency', error);
        this.snackBar.open('Erreur lors de la mise à jour de l\'agence', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  deleteAgence(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) {
      this.isLoading = true;
      this.agenceService.deleteAgence(id).subscribe({
        next: () => {
          this.loadAgences();
          this.snackBar.open('Agence supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting agency', error);
          this.snackBar.open('Erreur lors de la suppression de l\'agence', 'Fermer', {
            duration: 3000
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  showAgenceDetails(agence: Agence): void {
    this.dialog.open(AgenceDetailsComponent, {
      width: '800px',
      data: { agence }
    });
  }
  
  clearFilters(): void {
    this.searchControl.setValue('');
    this.villeControl.setValue('');
  }
  
  exportToExcel(): void {
    this.isLoading = true;
    this.agenceService.exportToExcel().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agences_${this.datePipe.transform(new Date(), 'yyyyMMdd')}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.snackBar.open('Export Excel réussi', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error exporting to Excel', error);
        this.snackBar.open('Erreur lors de l\'export Excel', 'Fermer', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}