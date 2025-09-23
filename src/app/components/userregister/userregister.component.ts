import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.css']
})
export class UserregisterComponent {

  // User model
  user = {
    name: '',
    surname: '',
    contactNumber: '',
    email: '',
    gender: '',
    location: '',
    password: '',
  };

  // Messages
  successMessage = '';
  errorMessage = '';

  // Password toggle flag
  showPassword: boolean = false;

  constructor(private authService: UserService, private router: Router) {}

  // Close form and navigate to login
  closeForm() {
    this.router.navigate(['/userlogin']);
  }

  // Register user
  registerUser() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.router.navigate(['/userlogin']);
      },
      error: (error) => {
        // Check if email already exists
        if (error?.error === 'Email already exists') {
          this.errorMessage = 'Email already exists. Please use another email.';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }
        this.successMessage = '';
      }
    });
  }

  // Toggle password visibility
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}