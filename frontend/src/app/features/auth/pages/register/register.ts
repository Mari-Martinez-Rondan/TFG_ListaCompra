import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class RegisterComponent {
    data={ nombreUsuario: '',nombre: '',apellido1: '',apellido2: '',telefono: '', email: '', contrasena: '' , confirmar: ''};
    errorMessage: string | null = null
    loading = false;

    constructor(private authService: AuthService, private router: Router) {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/inicio']);
      }
    }

    onSubmit(): void {
      this.errorMessage = null;
      if (!this.data.nombreUsuario || !this.data.nombre || !this.data.apellido1 || !this.data.email || !this.data.contrasena){
        this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
        return;
      };
      if (this.data.contrasena !== this.data.confirmar) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      this.loading = true;
     const playload = { nombreUsuario: this.data.nombreUsuario, nombre: this.data.nombre, apellido1: this.data.apellido1, apellido2: this.data.apellido2, telefono: this.data.telefono, email: this.data.email, contrasena: this.data.contrasena };
      this.authService.register(playload).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: (err) => {
          const serverMsg = err && err.error ? err.error : null;
          if (serverMsg && typeof serverMsg === 'string') {
            this.errorMessage = `Error al crear la cuenta: ${serverMsg}`;
          } else if (err && err.status) {
            this.errorMessage = `Error al crear la cuenta: ${err.status} ${err.statusText || ''}`.trim();
          } else {
            this.errorMessage = 'Error al crear la cuenta: ' + (err?.message || 'unknown');
          }
          this.loading = false;
        }
      });
    }
}