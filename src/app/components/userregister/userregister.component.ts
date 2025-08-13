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

  constructor(private authService: UserService, private router: Router) {}

  registerUser() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Registration failed. Try again.';
        this.successMessage = '';
      }
    });
  }
}
