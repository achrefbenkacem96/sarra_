import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm!: FormGroup;
  selectedImage: File | undefined;
  defaultImage: File | undefined;  // default image to send if user does not choose one
  message: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  messageType: 'success' | 'error' | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Build the form with the new validation rules
    this.signupForm = this.fb.group({
      cin: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]+$') // Only allows numeric characters
      ]],
      name: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      location: ['', Validators.required],
      password: ['', [
        Validators.required,
        // Must be at least 6 characters, contain at least one uppercase letter and one symbol
        Validators.pattern('^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$')
      ]]
    });
    

    // Preload the default image from assets (adjust the path if needed)
    this.http.get('assets/images/magh.png', { responseType: 'blob' })
      .subscribe(blob => {
        this.defaultImage = new File([blob], 'magh.png', { type: blob.type });
      });
  }

  onFileSelected(event: any): void {
    this.message = '';
    this.messageType = null;
    const file = event.target.files[0];

    if (!file) return;

    // Validate image type
    if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
      this.message = 'Required image: Only JPG, PNG, or GIF images are allowed!';
      this.messageType = 'error';
      this.selectedImage = undefined;
      this.imagePreview = null;
      return;
    }
    // Validate file size (<2MB)
    if (file.size > 2097152) {
      this.message = 'Image size must be less than 2MB!';
      this.messageType = 'error';
      this.selectedImage = undefined;
      this.imagePreview = null;
      return;
    }
    this.selectedImage = file;

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  removeImage(fileInput: HTMLInputElement): void {
    this.selectedImage = undefined;
    this.imagePreview = null;
    fileInput.value = ''; // This clears the file input
  }

  onSubmit(): void {
    this.message = '';
    this.messageType = null;

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const user: User = {
      cin: this.signupForm.value.cin,
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      location:this.signupForm.value.location
      // You can add location to your User model if needed.
    };

    // If no image is selected, use the preloaded default image.
    const imageToSend = this.selectedImage ? this.selectedImage : this.defaultImage;
    this.loading = true;
    this.userService.signup(user, imageToSend).subscribe({
      next: (response) => {
        this.message = 'User created successfully!';
        this.messageType = 'success';
        this.signupForm.reset();
        this.selectedImage = undefined;
        this.imagePreview = null;
        this.userService.signupEmail = this.signupForm.value.email;
        this.router.navigate(['/verify']);
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = 'Signup failed: Email or CIN already exists';
        this.loading = false; // Stop loading on error
      },
      complete: () => {
        this.loading = false; // Stop loading
      }
    });
  }
}
