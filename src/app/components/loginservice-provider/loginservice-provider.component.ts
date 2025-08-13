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

  fileError = false;
  mobileError = false;

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  // ✅ Register logic
 onFileSelected(event: any): void {
  const file: File = event.target.files[0];
 
  if (file) {
    const validTypes = ['image/png', 'image/jpeg'];
 
    if (!validTypes.includes(file.type)) {
      this.fileError = true;
      this.selectedFile = null;
    } else {
      this.fileError = false;
      this.selectedFile = file;
    }
  }
}

onSubmit(): void {
  this.mobileError = false;
 
  // 1️⃣ Validate file type
  if (this.fileError) {
    alert('Please upload a valid PNG or JPEG image.');
    return;
  }
 
  // 2️⃣ Validate mobile number format (10-digit, starts with 6-9)
  const mobilePattern = /^[6-9]\d{9}$/;
  if (!mobilePattern.test(this.form.mobileNumber)) {
    this.mobileError = true;
    alert('Invalid mobile number. It must be 10 digits and start with 6-9.');
    return;
  }
 
  // 3️⃣ Prepare FormData
  const formData = new FormData();
  const providerJson = JSON.stringify(this.form);
  const providerBlob = new Blob([providerJson], { type: 'application/json' });
  formData.append('provider', providerBlob);
 
  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }
 
  // 4️⃣ Send to backend
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