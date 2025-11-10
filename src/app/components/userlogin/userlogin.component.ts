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
  showPassword: boolean = false; // 👁 toggle flag

  constructor(private authService: UserService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 loginUser() {
  this.authService.login(this.email, this.password).subscribe({
    next: (response) => {
      // Check if backend returns both token and user details
      if (response.token && response.user) {
        // ✅ Save user details and token separately
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } else {
        // ✅ If backend returns only user info
        localStorage.setItem('user', JSON.stringify(response));
      }

      console.log('Response from Database:', response);
      this.router.navigate(['/']); // Redirect after login
    },
    error: () => {
      this.errorMessage = 'Invalid email or password';
    }
  });
}

}
