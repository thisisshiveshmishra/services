import { Component } from '@angular/core';
import { ServiceProviderService } from '../service/service-provider.service';

@Component({
  selector: 'app-loginservice-provider',
  templateUrl: './loginservice-provider.component.html',
  styleUrls: ['./loginservice-provider.component.css']
})
export class LoginserviceProviderComponent {
email: string = '';
  loginMessage: string = '';

  constructor(private serviceProviderService: ServiceProviderService) {}

  onLogin() {
    this.serviceProviderService.loginProvider(this.email).subscribe({
      next: msg => this.loginMessage = msg,
      error: err => this.loginMessage = err.error
    });
  }

}
