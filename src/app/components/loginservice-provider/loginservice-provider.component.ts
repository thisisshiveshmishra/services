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
 
  // Eye toggle states
  showLoginPassword: boolean = false;
  showRegisterPassword: boolean = false;
 
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
  locationError = false;
  categoryError = false;
 
  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}
 
  // Eye toggle methods
  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }
 
  toggleRegisterPassword(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }
 
  // ✅ File selection
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
 
  // ✅ Register logic
  onSubmit(): void {
    this.mobileError = false;
    this.locationError = false;
    this.categoryError = false;
 
    if (this.fileError) {
      alert('Please upload a valid PNG or JPEG image.');
      return;
    }
 
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(this.form.mobileNumber)) {
      this.mobileError = true;
      alert('Invalid mobile number. It must be 10 digits and start with 6-9.');
      return;
    }
 
    if (!this.form.location || this.form.location.trim() === '') {
      this.locationError = true;
      alert('Location is required.');
      return;
    }
 
    if (!this.form.category || this.form.category.trim() === '') {
      this.categoryError = true;
      alert('Category is required.');
      return;
    }
 
    // Prepare FormData
    const formData = new FormData();
    const providerJson = JSON.stringify(this.form);
    const providerBlob = new Blob([providerJson], { type: 'application/json' });
    formData.append('provider', providerBlob);
 
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
 
    this.serviceProviderService.saveProvider(formData).subscribe({
      next: () => {
        alert('Service provider registered successfully!');
        this.form = {};              // ✅ Clear the form
 this.selectedFile = null;    // ✅ Clear the selected file
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
 