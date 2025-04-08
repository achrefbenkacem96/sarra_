import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  userEmail!: string | null;
  message: string = '';
  messageType: 'success' | 'error' | null = null; // To control message styling
  loading: boolean = false; // Loading indicator for verification
  resendLoading: boolean = false; // Loading indicator for resending OTP
  isResend: boolean = false; // Flag to check if resend is in progress

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', Validators.required]
    });

    // ✅ Retrieve the email from localStorage
    this.userEmail = localStorage.getItem('signupEmail');

    if (!this.userEmail) {
      // If email is missing, redirect back to signup
      this.router.navigate(['/signup']);
      return;
    }
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const email = this.userEmail ?? '';
    if (!email) {
      this.message = "Email is missing. Please sign up again.";
      this.messageType = 'error';
      return;
    }

    // ✅ Show loading state for verification
    this.loading = true;
    this.message = ''; // Clear previous messages

    // ✅ Use the stored email for verification
    const verificationData = {
      email: email,
      otp: this.otpForm.value.otp
    };

    this.userService.verifyOtp(verificationData).subscribe({
      next: () => {
        this.message = "Your account has been verified successfully!";
        this.messageType = 'success';

        // ✅ Clear stored email after successful verification
        localStorage.removeItem('signupEmail');

        // ✅ Redirect after a short delay for better UX
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        this.message = "OTP verification failed: " + error.error;
        this.messageType = 'error';
        
        // ✅ Stop loading so user can retry
        this.loading = false;

        // ✅ Clear OTP field for a fresh start
        this.otpForm.reset();
      },
      complete: () => {
        this.loading = false; // Stop loading in any case
      }
    });
  }

  resendOtp(): void {
    this.message = ''; // Clear previous messages
    this.resendLoading = true; // Show loading state for resend
    this.isResend = true; // Mark resend in progress

    const email = this.userEmail ?? '';
    if (!email) {
      this.message = 'Email is missing. Please sign up again.';
      this.messageType = 'error';
      this.resendLoading = false; // Stop resend loading
      this.isResend = false; // Reset resend flag
      return;
    }

    // Disable the form fields (input and button) while resending OTP
    this.otpForm.disable(); // Disable form controls

    // Call the service to resend the OTP to the user's email
    this.userService.resendOtp(email).subscribe({
      next: () => {
        this.message = 'OTP has been resent successfully to your email!';
        this.messageType = 'success';
        setTimeout(() => {
          this.otpForm.enable();
        }, 1500);// Give user time to read message before reload
      },
      error: (error) => {
        this.message = 'Failed to resend OTP: ' + error.error;
        this.messageType = 'error';
        this.resendLoading = false; // Stop resend loading
        this.isResend = false; // Reset resend flag
      },
      complete: () => {
        this.resendLoading = false; // Stop resend loading
        this.isResend = false; // Reset resend flag
      }
    });
  }
}
