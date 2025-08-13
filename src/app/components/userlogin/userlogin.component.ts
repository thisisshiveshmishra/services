import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})
export class UserloginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: UserService, private router: Router) {}

  loginUser() {
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Response from Database:',user);
        this.router.navigate(['/']); // Redirect after login
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}