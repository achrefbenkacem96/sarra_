import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Performance } from '../../../../models/performance.model';
import { Agence } from '../../../../models/agences.model';

@Component({
  selector: 'app-performance-form-dialog',
  templateUrl: './performance-form-dialog.component.html',
  styleUrls: ['./performance-form-dialog.component.scss']
})
export class PerformanceFormDialogComponent implements OnInit {
  performanceForm: FormGroup;
  dialogTitle: string;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PerformanceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { performance: Performance, isEditMode: boolean, agences: Agence[] }
  ) {
    this.dialogTitle = data.isEditMode ? 'Modifier la performance' : 'Ajouter une nouvelle performance';
    
    this.performanceForm = this.fb.group({
      chiffreAffaire: ['', [Validators.required, Validators.min(0)]],
      nombreContrats: ['', [Validators.required, Validators.min(0)]],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      agence: ['', Validators.required]
    });
    
    if (data.isEditMode && data.performance) {
      const formValue = {
        ...data.performance,
        dateDebut: new Date(data.performance.dateDebut).toISOString().slice(0, 10),
        dateFin: new Date(data.performance.dateFin).toISOString().slice(0, 10),
        agence: data.performance.agence?.idAgence
      };
      
      this.performanceForm.patchValue(formValue);
    }
  }

  ngOnInit(): void {
  }
  
  onSubmit(): void {
    if (this.performanceForm.invalid) {
      return;
    }
    
    const performanceData = this.performanceForm.value;
    this.dialogRef.close(performanceData);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
} 