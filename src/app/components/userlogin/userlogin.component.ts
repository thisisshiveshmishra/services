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
  showPassword: boolean = false;

  constructor(private authService: UserService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginUser() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.token && response.user) {
          localStorage.setItem('userToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          localStorage.setItem('user', JSON.stringify(response));
        }

        console.log('Response from Database:', response);
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

}
