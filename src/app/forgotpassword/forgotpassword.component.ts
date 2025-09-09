import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { passwordValidator } from './password-validator';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent{
  email: string = '';
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private userService: UserService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  resetPassword(form: any) {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.userService.forgotPassword(this.email, this.newPassword).subscribe({
      next: (res) => {
        this.message = res;
        this.errorMessage = '';
        this.email = '';
        this.newPassword = '';
        form.resetForm();
      },
      error: (err) => {
        this.message = '';
        this.errorMessage = err.error || 'Something went wrong';
      }
    });
  }
}