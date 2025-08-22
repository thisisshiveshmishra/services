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
  showPassword: boolean = false;  // 👁️ password toggle flag

  constructor(private authService: UserService, private router: Router) {}
closeForm() {
    // navigate user back to login or homepage
    this.router.navigate(['/userlogin']);
  }

  registerUser() {
    this.authService.register(this.user).subscribe({
      next: () => {
        alert("User Registration Successful!");
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.router.navigate(['/userlogin']);
      },
      error: () => {
        this.errorMessage = 'Registration failed. Try again.';
        this.successMessage = '';
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
