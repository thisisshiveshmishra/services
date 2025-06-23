import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-loginservice-provider',
  templateUrl: './loginservice-provider.component.html',
  styleUrls: ['./loginservice-provider.component.css']
})
export class LoginserviceProviderComponent {
   // 🔐 Login data
  email = '';
  password = '';
  message = '';

  // 📝 Register data
  form: any = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    location: '',
    gender: '',
    category: '',
    password: '',
  };
  selectedFile: File | null = null;

  categories: string[] = [
    'MOTOR_GARAGE_REPAIRING',
    'HOSPITAL',
    'SPORTS_REGARDS',
    'LAPTOP_REPAIRING',
    'HOTELS',
    'MOB_REPAIRING',
    'EMOTIONAL_GUIDER',
    'HEALTH_ADVISER',
    'BEAUTY_PARLORS',
    'RENT_ROOM_ADVISER',
    'SOFTWARE_QA',
    'DATA_SCIENCE',
    'SOFTWARE_DEVELOPER',
    'CYBER_SECURITY',
    'WATER_SUPPLIER_RO',
    'TOURIST_GUIDER',
  ];

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  // ✅ Register logic
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('firstName', this.form.firstName);
    formData.append('lastName', this.form.lastName);
    formData.append('mobileNumber', this.form.mobileNumber);
    formData.append('email', this.form.email);
    formData.append('location', this.form.location);
    formData.append('gender', this.form.gender);
    formData.append('category', this.form.category);
    formData.append('password', this.form.password);

    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }

    this.serviceProviderService.registerProvider(formData).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        alert('Service provider registered successfully!');
        this.router.navigate(['/loginserviceprovider']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Please try again.');
      },
    });
  }

  // ✅ Login logic
  onLogin(): void {
    this.serviceProviderService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.message = response;
        localStorage.setItem('providerEmail', this.email);
        this.router.navigate(['/dashboardserviceprovider']);
      },
      error: (error) => {
        this.message = error.error || 'Login failed';
      },
    });
  }

  // 🎯 Panel toggle logic
  toggleSignUp(): void {
    const container = this.el.nativeElement.querySelector('#container');
    if (container) {
      this.renderer.addClass(container, 'right-panel-active');
    }
  }

  toggleSignIn(): void {
    const container = this.el.nativeElement.querySelector('#container');
    if (container) {
      this.renderer.removeClass(container, 'right-panel-active');
    }
  }
}