import { Component } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoSupermercadoService } from '../../../../core/services/ProductoSupermercadoService';
import { ProductoSupermercado } from '../../../../core/models/ProductoSupermercado';

@Component({
  selector: 'app-comparador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comparador.html',
  styleUrls: ['./comparador.css']
})
export class ComparadorComponent {

  termino = '';
  resultados: ProductoSupermercado[] = [];
  cargando = false;
  error: string | null = null;

  constructor(private productosService: ProductoSupermercadoService) {}

  buscar() {
    if (!this.termino || this.termino.trim().length < 2) return;
    this.cargando = true;
    this.error = null;
    this.productosService.getTodos().subscribe({
      next: (todos: ProductoSupermercado[] | null) => {
        this.resultados = (todos || []).filter(p =>
          (p.nombre || '').toLowerCase().includes(this.termino.toLowerCase())
        );
        this.cargando = false;
      },
      error: (err: any) => {
        this.error = 'Error al buscar los productos.';
        this.cargando = false;
      }
    });
  }

  precioNumerico(precio: string): number {
    if (!precio) return Infinity;
    return parseFloat(precio.replace("€", "").replace(",", ".").trim()) || Infinity;
  }

  ordenarPorPrecio() {
    this.resultados.sort((a, b) =>
      this.precioNumerico(a.precio) - this.precioNumerico(b.precio)
    );
  }
}
