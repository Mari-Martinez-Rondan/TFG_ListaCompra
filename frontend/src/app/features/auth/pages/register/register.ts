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
    data={ usuario: '', email: '', password: '' , confirmar: ''};
    errorMessage: string | null = null

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit(): void {
      if (!this.data.usuario || !this.data.email || !this.data.password) return;
      if (this.data.password !== this.data.confirmar) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }
      this.authService.register(this.data).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.errorMessage = 'Error al crear la cuenta: ' + err.message;
        }
      });
    }
}