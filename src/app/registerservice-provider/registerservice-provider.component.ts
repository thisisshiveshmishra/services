import { Component } from '@angular/core';
import { ServiceProviderService } from '../service/service-provider.service';

@Component({
  selector: 'app-registerservice-provider',
  templateUrl: './registerservice-provider.component.html',
  styleUrls: ['./registerservice-provider.component.css']
})
export class RegisterserviceProviderComponent {
form: any = {};
  selectedFile!: File;

  constructor(private serviceProviderService: ServiceProviderService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('firstName', this.form.firstName);
    formData.append('lastName', this.form.lastName);
    formData.append('mobileNumber', this.form.mobileNumber);
    formData.append('email', this.form.email);
    formData.append('category', this.form.category);
    formData.append('gender', this.form.gender);
    formData.append('profilePicture', this.selectedFile);

    this.serviceProviderService.registerProvider(formData).subscribe({
      next: res => alert('Registration successful!'),
      error: err => alert('Registration failed!')
    });
  }
}


