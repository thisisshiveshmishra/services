import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent {
  email: string = '';
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  // ✅ Email + Password validation flags
  isEmailValid = false;
  hasUppercase = false;
  hasLowercase = false;
  hasNumber = false;
  hasSpecialChar = false;
  isMinLength = false;
  isPasswordValid = false;

  constructor(private userService: UserService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateEmail() {
    const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    this.isEmailValid = emailPattern.test(this.email);
  }

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

  resetPassword(form: any) {
    if (!this.isEmailValid || !this.isPasswordValid) {
      this.errorMessage = 'Please fix the highlighted errors.';
      this.message = '';
      return;
    }

    this.userService.forgotPassword(this.email, this.newPassword).subscribe({
      next: (res) => {
        this.message = res;
        this.errorMessage = '';
        form.resetForm();
        this.resetChecks();
      },
      error: (err) => {
        this.message = '';
        this.errorMessage = err.error || 'Something went wrong';
      }
    });
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