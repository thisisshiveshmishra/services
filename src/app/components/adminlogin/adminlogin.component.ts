import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';



@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminLoginComponent implements OnInit {
    loginForm!: FormGroup;
  registerForm!: FormGroup;
  submittedLogin = false;
  submittedRegister = false;
  passwordFieldType = 'password';
  isSignupMode = false;

  constructor(private fb: FormBuilder, private adminService: AdminService ,private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get fLogin() {
    return this.loginForm.controls;
  }

  get fRegister() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLoginSubmit(): void {
    this.submittedLogin = true;
    if (this.loginForm.invalid) return;

    // Call login API
    console.log('Login Data:', this.loginForm.value);
    window.alert('Login Successful');
    this.router.navigate(['/admindashboard']);
  }

  onRegisterSubmit(): void {
    this.submittedRegister = true;
    if (this.registerForm.invalid) return;

    // Call register API
    this.adminService.register(this.registerForm.value).subscribe({
      next: () => alert('Registration successful!'),
      error: () => alert('Registration failed.')
    });
  }

 triggerRegister(event: Event) {
  event.preventDefault();
  const chk = document.getElementById('chk') as HTMLInputElement;
  chk.checked = true;
}

triggerLogin(event: Event) {
  event.preventDefault();
  const chk = document.getElementById('chk') as HTMLInputElement;
  chk.checked = false;
}

}
