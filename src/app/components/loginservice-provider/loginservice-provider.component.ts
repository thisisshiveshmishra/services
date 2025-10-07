import { Component, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProviderService } from 'src/app/services/service-provider.service';

@Component({
  selector: 'app-loginservice-provider',
  templateUrl: './loginservice-provider.component.html',
  styleUrls: ['./loginservice-provider.component.css']
})
export class LoginserviceProviderComponent {

  // Login fields
  email = '';
  password = '';
  message = '';

  // Password visibility toggles
  showLoginPassword = false;
  showRegisterPassword = false;

  // Registration form
  form: any = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    location: '',
    gender: '',
    category: '',
    password: '',
    description: '',
  };

  selectedFile: File | null = null;

  // Error flags
  fileError = false;
  mobileError = false;
  locationError = false;
  categoryError = false;
  descriptionError = false;
  genderError = false;
  loginEmailError = false;

  // Regex patterns
  namePattern = /^[A-Za-z]{2,30}$/;
  mobilePattern = /^[6-9]\d{9}$/;
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  locationPattern = /^[A-Za-z\s,]{2,50}$/;
  categoryPattern = /^[A-Za-z\s]{2,50}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%?&]).{6,}$/;

  constructor(
    private serviceProviderService: ServiceProviderService,
    private router: Router,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  // Toggle eye icon for login password
  toggleLoginPassword(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  // Toggle eye icon for register password
  toggleRegisterPassword(): void {
    this.showRegisterPassword = !this.showRegisterPassword;
  }

  // Validate and store selected file
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type) || file.size > maxSize) {
        this.fileError = true;
        this.selectedFile = null;
      } else {
        this.fileError = false;
        this.selectedFile = file;
      }
    }
  }

  // Registration submit
  onSubmit(): void {
    // Reset error flags
    this.mobileError = false;
    this.locationError = false;
    this.categoryError = false;
    this.descriptionError = false;
    this.genderError = false;

    // Validations
    if (!this.namePattern.test(this.form.firstName)) return;
    if (!this.namePattern.test(this.form.lastName)) return;

    if (!this.mobilePattern.test(this.form.mobileNumber)) {
      this.mobileError = true;
      return;
    }

    if (!this.form.gender) {
      this.genderError = true;
      return;
    }

    if (!this.emailPattern.test(this.form.email)) return;

    if (!this.locationPattern.test(this.form.location)) {
      this.locationError = true;
      return;
    }

    if (!this.categoryPattern.test(this.form.category)) {
      this.categoryError = true;
      return;
    }

    if (!this.form.description?.trim() || this.form.description.length < 10) {
      this.descriptionError = true;
      return;
    }

    if (!this.passwordPattern.test(this.form.password)) return;

    if (this.fileError) return;

    // Prepare FormData
    const formData = new FormData();
    const providerJson = JSON.stringify(this.form);
    const providerBlob = new Blob([providerJson], { type: 'application/json' });
    formData.append('provider', providerBlob);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    // Call backend API
    this.serviceProviderService.saveProvider(formData).subscribe({
      next: () => {
        alert('Service provider registered successfully!');
        this.form = {};
        this.selectedFile = null;
        this.router.navigate(['/loginserviceprovider']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        if (err?.error?.message) {
          alert(err.error.message);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    });
  }

  onLogin(): void {
  if (!this.emailPattern.test(this.email)) {
    this.loginEmailError = true;
    return;
  }
  this.loginEmailError = false;

  this.serviceProviderService.login(this.email, this.password).subscribe({
    next: (response: string) => {
      this.message = response;   // plain string
      localStorage.setItem('providerEmail', this.email);
      this.router.navigate(['/dashboardserviceprovider']);
    },
    error: (error) => {
      this.message = error.error || 'Login failed. Please check your credentials.';
    }
  });
}


  // Switch UI panels
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
