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

  constructor(private serviceprovider: ServiceProviderService, private router : Router) {}

  onResetPassword(): void {
  this.serviceprovider.forgotPassword(this.resetData.email, this.resetData.newPassword).subscribe(
    (res) => {
      this.message = res; // Show "Password updated successfully"

      // Wait 5 seconds before navigating
      setTimeout(() => {
        this.router.navigate(['/loginserviceprovider']);
      }, 5000); // 5000 ms = 5 seconds
    },
    (err) => {
      this.message = err.error || 'Error resetting password';
    }
  );
}

}