import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoSupermercadoService } from '../../../core/services/ProductoSupermercadoService';
import { TokenService } from '../../../core/services/token.service';
import { ListaService } from '../../../core/services/lista.service';
import { ListaApiService } from '../../../core/services/lista-api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ProductoSupermercado } from '../../../core/models/ProductoSupermercado';
import { RouterModule } from '@angular/router';
import { ProductoApiService } from '../../../core/services/producto-api.service';

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
  showOnlyFavorites = false;

  @Input() onlyFavorites = false;
  @Input() showHeader = true;
  @Input() showFavoritesToggle = false;

  constructor(private productosService: ProductoSupermercadoService,
              private tokenService: TokenService,
              private listaService: ListaService,
              private listaApiService: ListaApiService,
              private notificationService: NotificationService,
              private favoritesService: FavoritesService,
              private productoApi: ProductoApiService) {}

  ngOnInit(): void {
    // Cargar ambos supermercados
    this.cargarTodos();
    this.refreshLists();
    if (this.onlyFavorites) {
      this.showOnlyFavorites = true;
    }
    }

  refreshLists(): void {
    // Cargar listas desde el servidor si hay sesión iniciada
    if (this.tokenService.isLoggedIn()) {
      this.listaApiService.obtenerMisListas().subscribe({
        next: (res) => {
          const l = res || [];
          this.listas = l.map((x: any) => ({ id: String(x.id), name: x.nombre || x.name || `Lista ${x.id}` }));
          this.activeListId = this.listaService.getActiveListId() || (this.listas.length ? this.listas[0].id : undefined);
        },
        error: (err) => {
          console.error('Error cargando listas desde API:', err);
          this.listas = this.listaService.getLists().map(l => ({ id: l.id, name: l.name }));
          this.activeListId = this.listaService.getActiveListId();
        }
      });
      return;
    }

    // Fallback a las listas en localStorage cuando no hay sesión.
    this.listas = this.listaService.getLists().map(l => ({ id: l.id, name: l.name }));
    this.activeListId = this.listaService.getActiveListId();
  }

  // Crear una nueva lista y refrescar la vista
  createListPrompt(): void {
    const name = window.prompt('Nombre de la nueva lista:', 'Nueva lista');
    if (name && name.trim().length > 0) {
      const id = this.listaService.createList(name.trim());
      this.listaService.setActiveList(id);
      this.refreshLists();
      this.notificationService.show(`Lista "${name.trim()}" creada`);
    }
  }

  // Establecer la lista activa y refrescar los elementos mostrados
  selectList(id: string | undefined): void {
    if (!id) return;
    this.listaService.setActiveList(id);
    this.activeListId = id;
    this.notificationService.show('Lista seleccionada');
  }

  // Cargar todos los productos
  cargarTodos(): void {
    this.cargando = true;
    //Asegurar que el interceptor añadirá el encabezado Authorization cuando exista un token
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
        // Aplicar filtros y búsqueda
        let resultado = this.filtrarPorSupermercado();
          if (this.showOnlyFavorites) {
            resultado = resultado.filter(p => this.favoritesService.isFavorite(this.keyFor(p)));
          }
        return resultado;
    }

    // Añadir un producto a la lista activa
    agregarALista(p: ProductoSupermercado): void {
      const activeListId = this.activeListId;
      if (!activeListId) {
        this.notificationService.show('No hay ninguna lista activa. Por favor, crea o selecciona una lista primero.');
        return;
      }

      const payload = {
        idExterno: String(p.id),
        supermercado: p.supermercado || '',
        cantidad: 1,
        nombre: p.nombre
      };

      //Si el usuario ha iniciado sesión, intentar persistir vía el endpoint de lista del backend
      if (this.tokenService.isLoggedIn()) {
        this.productoApi.agregarProductoALista(Number(activeListId), payload).subscribe({
          next: () => {
            this.notificationService.show(`Producto "${p.nombre}" añadido a la lista`);
          },
          error: (err) => {
            console.error('Error añadiendo producto a la lista (backend):', err);
            // Fallback to local storage behavior
            this.listaService.addProducto(p, 1);
            this.notificationService.show('Producto añadido localmente (error al guardar en servidor)');
          }
        });
        return;
      }

      // Fallback: usar listas en localStorage cuando no se ha iniciado sesión
      this.listaService.addProducto(p, 1);
      const activeMeta = this.listas.find(l => l.id === this.listaService.getActiveListId());
      const listName = activeMeta ? activeMeta.name : 'lista actual';
      this.notificationService.show(`Añadido «${p.nombre}» a ${listName}`);
    }

    // Alternar la vista de favoritos
    toggleFavoriteView(): void {
      this.showOnlyFavorites = !this.showOnlyFavorites;
    }

    // Comprobar si un producto está en favoritos
    isFavorite(p: ProductoSupermercado): boolean {
      return this.favoritesService.isFavorite(this.keyFor(p));
    }

    // Alternar favorito de un producto
    toggleFavorite(p: ProductoSupermercado): void {
      const added = this.favoritesService.toggleFavorite(this.keyFor(p));
      this.notificationService.show(added ? `"${p.nombre}" añadido a Favoritos` : `"${p.nombre}" eliminado de Favoritos`);
    }

    // Eliminar un producto de favoritos
    removeFavorite(p: ProductoSupermercado): void {
      this.favoritesService.removeFavorite(this.keyFor(p));
      this.notificationService.show(`"${p.nombre}" eliminado de Favoritos`);
    }

    // Generar una clave única para un producto basada en id y supermercado
    keyFor(p: ProductoSupermercado): string {
      // composite key: id + supermarket helps disambiguate same id across sources
      const sup = (p.supermercado || '').replace(/\s+/g, '_');
      return `${p.id}_${sup}`;
    }

    // Convertir un precio en formato string a número
    precioNumerotico(precio: string): number {
        return parseFloat(precio.replace("€", "").replace(",", ".").trim()) || Infinity;
    }
}
