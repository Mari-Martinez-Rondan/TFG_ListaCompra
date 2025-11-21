import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoSupermercadoService } from '../../../core/services/ProductoSupermercadoService';
import { TokenService } from '../../../core/services/token.service';
import { ListaService } from '../../../core/services/lista.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductoSupermercado } from '../../../core/models/ProductoSupermercado';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listadoProductos.html',
  styleUrls: ['./listadoProductos.css']
})
export class ListadoProductosComponent implements OnInit {

  productos: ProductoSupermercado[] = [];
  cargando = true;
  error: string | null = null;
  filtroSupermercado: string = '';
  searchTerm: string = '';
  listas: { id: string; name: string }[] = [];
  activeListId?: string;

  constructor(private productosService: ProductoSupermercadoService,
              private tokenService: TokenService,
              private listaService: ListaService,
              private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Cargar ambos supermercados
    this.cargarTodos();
    this.refreshLists();
    }

  refreshLists(): void {
    this.listas = this.listaService.getLists().map(l => ({ id: l.id, name: l.name }));
    this.activeListId = this.listaService.getActiveListId();
  }

  createListPrompt(): void {
    const name = window.prompt('Nombre de la nueva lista:', 'Nueva lista');
    if (name && name.trim().length > 0) {
      const id = this.listaService.createList(name.trim());
      this.listaService.setActiveList(id);
      this.refreshLists();
      this.notificationService.show(`Lista "${name.trim()}" creada`);
    }
  }

  selectList(id: string | undefined): void {
    if (!id) return;
    this.listaService.setActiveList(id);
    this.activeListId = id;
    this.notificationService.show('Lista seleccionada');
  }

  cargarTodos(): void {
    this.cargando = true;
    // Debug: mostrar token (si existe) para verificar que el interceptor lo enviará
    const tk = this.tokenService.getToken();
    console.debug('Auth token en localStorage:', tk);
    this.productosService.getTodos().subscribe({
      next: (res) => {
        this.productos = res || [];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        // Mostrar mensaje más detallado cuando sea posible
        const status = err?.status ? ` (${err.status})` : '';
        const statusText = err?.statusText ? ` ${err.statusText}` : '';
        const message = err?.message ? ` - ${err.message}` : '';
        this.error = `Error al cargar los productos.${status}${statusText}${message}`;
        this.productos = [];
        this.cargando = false;
      }
    });
  }

    filtrarPorSupermercado(): ProductoSupermercado[] {
      let listadoFiltrado = this.productos;

      // Filtrado por supermercado
      if (this.filtroSupermercado) {
        listadoFiltrado = listadoFiltrado.filter(p => (p.supermercado || '').toLowerCase().includes(this.filtroSupermercado.toLowerCase()));
      }

      // Búsqueda por texto en varios campos
      if (this.searchTerm && this.searchTerm.trim().length > 0) {
        const q = this.searchTerm.trim().toLowerCase();
        listadoFiltrado = listadoFiltrado.filter(p => {
          return (p.nombre || '').toLowerCase().includes(q)
            || (p.marca || '').toLowerCase().includes(q)
            || (p.categoria || '').toLowerCase().includes(q)
            || (p.descripcion || '').toLowerCase().includes(q);
        });
      }

      return listadoFiltrado;
    }

    aplicarFiltro(): ProductoSupermercado[] {
      // Wrapper usado desde la plantilla; en el futuro puede incluir ordenación/paginación.
      return this.filtrarPorSupermercado();
    }

    agregarALista(p: ProductoSupermercado): void {
      this.listaService.addProducto(p, 1);
      const activeMeta = this.listas.find(l => l.id === this.listaService.getActiveListId());
      const listName = activeMeta ? activeMeta.name : 'lista actual';
      this.notificationService.show(`Añadido «${p.nombre}» a ${listName}`);
    }

    precioNumerotico(precio: string): number {
        return parseFloat(precio.replace("€", "").replace(",", ".").trim()) || Infinity;
    }
}
