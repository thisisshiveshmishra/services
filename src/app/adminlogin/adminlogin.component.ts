import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.css']
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  passwordFieldType: string | undefined;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters for easy access in HTML
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    // Add your login logic here
    console.log('Login success:', this.loginForm.value);

     // ✅ Show success popup
  window.alert('Login Successfully');
  }

  // Toggle password visibility
   togglePasswordVisibility() {
    this.passwordFieldType =
    this.passwordFieldType === 'password' ? 'text' : 'password';
  }

}
