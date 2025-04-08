import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agence } from '../../../../models/agences.model';

@Component({
  selector: 'app-agence-form-dialog',
  templateUrl: './agence-form-dialog.component.html',
  styleUrls: ['./agence-form-dialog.component.scss']
})
export class AgenceFormDialogComponent implements OnInit {
  agenceForm: FormGroup;
  dialogTitle: string;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AgenceFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { agence: Agence, isEditMode: boolean }
  ) {
    this.dialogTitle = data.isEditMode ? 'Modifier l\'agence' : 'Ajouter une nouvelle agence';
    
    this.agenceForm = this.fb.group({
      nomAgence: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      codePostal: ['', Validators.required],
      telephone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      responsable: ['', Validators.required],
    });
    
    if (data.isEditMode && data.agence) {
      this.agenceForm.patchValue(data.agence);
    }
  }

  ngOnInit(): void {
  }
  
  onSubmit(): void {
    if (this.agenceForm.invalid) {
      return;
    }
    
    const agenceData = this.agenceForm.value;
    this.dialogRef.close(agenceData);
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
} 