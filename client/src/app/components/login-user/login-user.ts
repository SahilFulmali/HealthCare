import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login-user',
  imports: [ReactiveFormsModule,RouterLink, FormsModule,CommonModule],
  templateUrl: './login-user.html',
  styleUrl: './login-user.css',
})
export class LoginUser {

  loginForm!: FormGroup;
  isSubmitted= false;
  loginError='';

  constructor( private fb: FormBuilder,
               private router:Router,
               private authService:Auth)
              {
                this.loginForm = this.fb.group({
                  email: ['', [Validators.required, Validators.email]],
                  password: ['', [Validators.required, Validators.minLength(6)]]
                });

               }

               get email(){
                return this.loginForm.controls['email'];
               }

               get password(){
                return this.loginForm.controls['password']
               }

               getEmailErrors(): string[]{
                const error:string[]=[];
                if(this.email.errors?.['required']){
                  error.push('Email is required');
                }
                if(this.email.errors?.['email']){
                  error.push("Invalid email format")
                }
                return error;
               }

               getPasswordErrors(): string[]{
                const error:string[]=[];
                if(this.password.errors?.['required']){
                  error.push('Password is required');
                }
                if(this.password.errors?.['minlength']){
                  error.push("password must be atleast 6 Characters")
                }
                return error;
               }

               get f() {
                return this.loginForm.controls
               }

               onSubmit():void{
               
this.loginError = '';

  if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  const success = this.authService.loginPatient(email, password);

  if (success) {
    this.router.navigate(['/patient']);
  } else {
    this.loginError = 'Invalid email or password';
  }

}

}
