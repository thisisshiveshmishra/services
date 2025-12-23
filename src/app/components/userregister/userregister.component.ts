import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userregister',
  templateUrl: './userregister.component.html',
  styleUrls: ['./userregister.component.css']
})
export class UserregisterComponent {

  user = {
    name: '',
    surname: '',
    contactNumber: '',
    email: '',
    gender: '',
    location: '',
    password: '',
  };

  successMessage = '';
  errorMessage = '';

  showPassword: boolean = false;

  constructor(private authService: UserService, private router: Router) { }

  closeForm() {
    this.router.navigate(['/userlogin']);
  }

  registerUser() {
    this.authService.register(this.user).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        alert('User Registration successful!');
        this.router.navigate(['/userlogin']);
      },
      error: (error) => {
        console.error('Backend error:', error);

        if (typeof error.error === 'string' && error.error.includes('Email is already in use')) {
          this.errorMessage = 'Email is already in use. Please use another email.';
        } else if (error.error?.message && error.error.message.includes('Email is already in use')) {
          this.errorMessage = 'Email is already in use. Please use another email.';
        } else {
          this.errorMessage = 'Registration failed. Try again.';
        }

        this.successMessage = '';
      }

    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}