import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-registerservice-provider',
  templateUrl: './registerservice-provider.component.html',
  styleUrls: ['./registerservice-provider.component.css']
})
export class RegisterserviceProviderComponent {
  form: any = {
        firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    location: '',
    gender: '',
    category: '',
    password: ''

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
    'TOURIST_GUIDER'
  ];

  constructor(private serviceProviderService: ServiceProviderService , private router:Router) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
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
      }
    });
  }
}