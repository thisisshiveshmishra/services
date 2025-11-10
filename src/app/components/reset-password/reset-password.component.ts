import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ForgotpasswordService } from 'src/app/services/forgotpassword.service';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  otp: string = '';
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  // Flags for step control
  otpSent: boolean = false;
  otpVerified: boolean = false;

  // ✅ Email + Password validation flags
  isEmailValid = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  hasSpecialChar = false;
  isMinLength = false;
  isPasswordValid = false;

  constructor(private forgotService: ForgotpasswordService) {}

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Validate Email
  validateEmail() {
    const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

  // Password strength check
  checkPasswordStrength() {
    const password = this.newPassword || '';
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasLowercase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[@#$%^&+=!]/.test(password);
    this.isMinLength = password.length >= 6;

    this.isPasswordValid =
      this.hasUppercase &&
      this.hasLowercase &&
      this.hasNumber &&
      this.hasSpecialChar &&
      this.isMinLength;
  }

  // 1️⃣ Send OTP
  sendOtp() {
    if (!this.isEmailValid) {
      this.errorMessage = 'Please enter a valid email.';
      return;
    }

    this.errorMessage = '';
    this.message = '';

    this.forgotService.requestOtp(this.email).subscribe({
      next: (res) => {
        this.message = res;
        this.otpSent = true;
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to send OTP.';
      }
    });
  }

  // 2️⃣ Verify OTP
  verifyOtp() {
    this.message = '';
    this.errorMessage = '';

    if (!this.otp) {
      this.errorMessage = 'Please enter the OTP sent to your email.';
      return;
    }

    this.forgotService.verifyOtp(this.email, this.otp).subscribe({
      next: (res) => {
        this.message = res;
        this.otpVerified = true;
      },
      error: (err) => {
        this.errorMessage = err.error || 'Invalid OTP.';
      }
    });
  }

  // 3️⃣ Reset Password
  resetPassword() {
    if (!this.isPasswordValid) {
      this.errorMessage = 'Please enter a strong password.';
      return;
    }

    this.errorMessage = '';
    this.message = '';

    this.forgotService.resetPassword(this.email, this.newPassword).subscribe({
  next: (res) => {
    this.message = res;
    this.errorMessage = '';
    this.resetForm();
  },
  error: (err) => {
    this.errorMessage = typeof err.error === 'string'
      ? err.error
      : 'Failed to reset password.';
  }
});

  }

  // Reset all fields and validations
  private resetForm() {
    this.email = '';
    this.otp = '';
    this.newPassword = '';
    this.otpSent = false;
    this.otpVerified = false;
    this.resetChecks();
  }

  private resetChecks() {
    this.isEmailValid = false;
    this.hasUppercase = false;
    this.hasLowercase = false;
    this.hasNumber = false;
    this.hasSpecialChar = false;
    this.isMinLength = false;
    this.isPasswordValid = false;
  }
}
