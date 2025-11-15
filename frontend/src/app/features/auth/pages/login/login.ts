import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { usuario: '', contrasena: '' };
  errorMessage: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.credentials.usuario || !this.credentials.contrasena) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/lista']);
      },
      error: (err) => {
        this.errorMessage = 'Error de inicio de sesión: ' + err.message;
      }
    });
  }
}