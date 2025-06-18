import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-loginservice-provider',
  templateUrl: './loginservice-provider.component.html',
  styleUrls: ['./loginservice-provider.component.css']
})
export class LoginserviceProviderComponent {
  email = '';
  password = '';
  message = '';

  constructor(private serviceProviderService: ServiceProviderService , private router: Router) {}

 onLogin(): void {
  this.serviceProviderService.login(this.email, this.password).subscribe({
    next: (response) => {
      this.message = response; // Optionally display the response message
      
      // ✅ Save email to localStorage
      localStorage.setItem('providerEmail', this.email);
      
      // ✅ Navigate to dashboard
      this.router.navigate(['/dashboardserviceprovider']);
    },
    error: (error) => {
      this.message = error.error || 'Login failed';
    }
  });
}

}
