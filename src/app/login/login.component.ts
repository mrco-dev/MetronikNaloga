import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DataService } from '../data.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  dataService = inject(DataService);
  router = inject(Router);

  loginError = false;
  formEmpty = false;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.dataService.login(username ?? '', password ?? '').subscribe(
        (success) => {
          if (success) {
            this.router.navigate(['/order-list']);
          } else {
            this.loginError = true;
            this.formEmpty = false;
          }
        },
        (error) => {
          console.error('Error during login', error);
        }
      );
    } else {
      this.formEmpty = true;
    }
  }
}
