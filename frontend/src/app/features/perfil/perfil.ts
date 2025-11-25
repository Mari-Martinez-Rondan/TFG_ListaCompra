import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PerfilService } from "../../core/services/perfil.service";
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class PerfilComponent implements OnInit {
  constructor(private perfilService: PerfilService, private tokenService: TokenService) {}
  perfilData: any = {};
  nuevaContrasena: string = '';
  mensajePerfil: string = '';
  mensajeContrasena: string = '';

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil() {
    this.perfilService.obtenerPerfil().subscribe(
      (perfil) => {
        this.perfilData = perfil;
      },
      (error) => {
        console.error('Error al cargar el perfil:', error);
      }
    );
  }
  
  guardarCambios() {
    this.perfilService.actualizarPerfil(this.perfilData).subscribe(
      (response) => {
        this.mensajePerfil = 'Perfil actualizado con éxito.';
      },
      (error) => {
        this.mensajePerfil = 'Error al actualizar el perfil.';
        console.error('Error al actualizar el perfil:', error);
      }
    );
  }

  cambiarContrasena() {
    this.perfilService.cambiarContrasena({ nuevaContrasena: this.nuevaContrasena }).subscribe(
      (response) => {
        this.mensajeContrasena = 'Contraseña cambiada con éxito.';
      },
      (error) => {
        this.mensajeContrasena = 'Error al cambiar la contraseña.';
        console.error('Error al cambiar la contraseña:', error);
      }
    );
  }
}