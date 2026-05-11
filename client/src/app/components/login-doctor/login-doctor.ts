import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login-doctor',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login-doctor.html',
  styleUrl: './login-doctor.css',
})
export class LoginDoctor {

  
loginForm!: FormGroup;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService:Auth
  ) {
    this.loginForm = this.fb.group({
      doctorId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  
 get doctorId() {
    return this.loginForm.controls['doctorId'];
  }

  get password() {
    return this.loginForm.controls['password'];
  }

  getDoctorIdErrors(): string[] {
    const errors: string[] = [];
    if (this.doctorId.errors?.['required']) {
      errors.push('Doctor ID is required');
    }
    return errors;
  }


  
getPasswordErrors(): string[] {
    const errors: string[] = [];
    if (this.password.errors?.['required']) {
      errors.push('Password is required');
    }
    if (this.password.errors?.['minlength']) {
      errors.push('Password must be at least 6 characters');
    }
    return errors;
  }


  
onSubmit(): void {
    
this.loginError = '';

  if (this.loginForm.invalid) return;

  const { doctorId, password } = this.loginForm.value;

  const success = this.authService.loginDoctor(doctorId, password);

  if (success) {
    this.router.navigate(['/doctor']);
  } else {
    this.loginError ="Invalid Doctor Id or Password"
  }

}




}
