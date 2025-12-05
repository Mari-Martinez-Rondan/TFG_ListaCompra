import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials = { nombreUsuario: '', contrasena: '' };
  errorMessage: string | null = null;
  loading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Redirige si ya está logueado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/inicio']);
    }
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (!this.credentials.nombreUsuario || !this.credentials.contrasena) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.loading = false;
        // Emitir mensaje de bienvenida con el nombre de usuario usado en el login
        const user = this.credentials.nombreUsuario || '';
        this.notificationService.show('Bienvenido ' + user + '!');
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.errorMessage = 'Error de inicio de sesión: ' + err.message;
        this.loading = false;
      }
    });
  }
}