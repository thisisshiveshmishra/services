import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
 resetData = { email: '', newPassword: '' };
  message = '';
  showPassword = false;   // 👁 state

  constructor(private serviceprovider: ServiceProviderService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onResetPassword(): void {
    if (!this.resetData.newPassword) {
      this.message = "Password cannot be empty.";
      return;
    }

    this.serviceprovider.forgotPassword(this.resetData.email, this.resetData.newPassword).subscribe(
      (res) => {
        this.message = res;
        setTimeout(() => {
          this.router.navigate(['/loginserviceprovider']);
        }, 5000);
      },
      (err) => {
        this.message = err.error || 'Error resetting password';
      }
    );
  }
}