import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  constructor(private router: Router) {}

  onLogin() {
    // Lógica de autenticación aquí
    // Si la autenticación es exitosa, redirigir al usuario al dashboard
    this.router.navigate(['/dashboard']);
  }
}