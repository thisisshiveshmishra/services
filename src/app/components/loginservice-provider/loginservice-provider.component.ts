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

  // ✅ Convert the form to JSON
  const providerJson = JSON.stringify(this.form);
  const providerBlob = new Blob([providerJson], { type: 'application/json' });

  // ✅ Append as one part named 'provider'
  formData.append('provider', providerBlob);

  // ✅ Append image file as 'image' (the same name as @RequestPart image)
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  this.serviceProviderService.saveProvider(formData).subscribe({
    next: (res) => {
      alert('Service provider registered successfully!');
      this.router.navigate(['/loginserviceprovider']);
    },
    error: (err) => {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    }
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