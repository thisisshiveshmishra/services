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
  isLogin = true;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) { }

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
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLoginSubmit(): void {
    this.submittedLogin = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (username === 'admin' && password === 'admin@123') {
      localStorage.setItem('adminToken', 'admin');
      alert('Login Successful');
      this.router.navigate(['/admindashboard']);
    } else {
      alert('Wrong credentials! Please try again.');
    }
  }


  onRegisterSubmit(): void {
    this.submittedRegister = true;
    if (this.registerForm.invalid) return;

    this.adminService.register(this.registerForm.value).subscribe({
      next: () => alert('Registration successful!'),
      error: () => alert('Registration failed.')
    });
  }

  login() {
    this.isLogin = true;
    const formBox = document.querySelector('.form-box') as HTMLElement;
    formBox.classList.remove('register-active');
  }

  register() {
    this.isLogin = false;
    const formBox = document.querySelector('.form-box') as HTMLElement;
    formBox.classList.add('register-active');
  }

  loginPasswordFieldType: string = 'password';

  toggleLoginPasswordVisibility() {
    this.loginPasswordFieldType =
      this.loginPasswordFieldType === 'password' ? 'text' : 'password';
  }

}

