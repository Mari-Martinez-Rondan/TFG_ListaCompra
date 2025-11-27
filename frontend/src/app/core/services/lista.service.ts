import { Injectable } from '@angular/core';
import { ProductoSupermercado } from '../models/ProductoSupermercado';
import { TokenService } from './token.service';

export interface ListaItem {
  producto: ProductoSupermercado;
  cantidad: number;
}

export interface ListaMeta {
  id: string;
  name: string;
  created: number;
  modified?: number;
}

interface IndexData {
  lists: ListaMeta[];
  activeId?: string;
}

@Injectable({ providedIn: 'root' })
export class ListaService {
  private indexKeyBase = 'listas_index';
  private listPrefix = 'lista_';
  private index: IndexData = { lists: [] };

  constructor(private tokenService: TokenService) {
    this.loadIndex();
    this.migrateOldSingleList();
    if (!this.index.lists || this.index.lists.length === 0) {
      const id = this.createList('Principal');
      this.setActiveList(id);
    }
  }

  // Método para refrescar la lista para el usuario actual
  refreshForCurrentUser(): void {
    try {
      const user = this.tokenService.getUsername() ?? 'anon';
      const userKey = `${this.indexKeyBase}_${user}`;
      const rawUser = localStorage.getItem(userKey);

      if (rawUser) {
        this.index = JSON.parse(rawUser) as IndexData;
        return;
      }

      const anonKey = `${this.indexKeyBase}_anon`;
      const rawAnon = localStorage.getItem(anonKey);
      if (rawAnon) {
        const anonIndex = JSON.parse(rawAnon) as IndexData;
        this.index = { lists: [] };
        for (const meta of anonIndex.lists) {
          const newMeta: ListaMeta = { ...meta };
          this.index.lists.push(newMeta);
          const legacyKey = `${this.listPrefix}${meta.id}_anon`;
          const legacyItems = localStorage.getItem(legacyKey);
          if (legacyItems) {
            const targetKey = `${this.listPrefix}${meta.id}_${user}`;
            if (!localStorage.getItem(targetKey)) {
              localStorage.setItem(targetKey, legacyItems);
            }
          }
        }
        localStorage.setItem(userKey, JSON.stringify(this.index));
        return;
      }

      this.index = { lists: [] };
    } catch (e) {
      this.index = { lists: [] };
    } finally {
      if (!this.index.lists || this.index.lists.length === 0) {
        const id = this.createList('Principal');
        this.setActiveList(id);
      }
    }
  }

  // Método para obtener la clave de índice para el usuario actual
  private getIndexKey(): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.indexKeyBase}_${user}`;
  }

  // Método para cargar el índice para el usuario actual
  private loadIndex(): void {
    try {
      const userKey = this.getIndexKey();
      const rawUser = localStorage.getItem(userKey);
      if (rawUser) {
        this.index = JSON.parse(rawUser) as IndexData;
        return;
      }
      this.index = { lists: [] };
    } catch (e) {
      this.index = { lists: [] };
    }
  }

  // Método para guardar el índice para el usuario actual
  private saveIndex(): void {
    const userKey = this.getIndexKey();
    localStorage.setItem(userKey, JSON.stringify(this.index));
  }

  // Método para obtener la clave de lista para el usuario actual
  private listKey(id: string): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.listPrefix}${id}_${user}`;
  }

  // Método para cargar los elementos de una lista para el usuario actual
  private loadListItems(id: string): ListaItem[] {
    try {
      const raw = localStorage.getItem(this.listKey(id));
      if (!raw) {
        const legacy = localStorage.getItem(`lista_${id}`);
        if (legacy) return JSON.parse(legacy) as ListaItem[];
      }
      return raw ? JSON.parse(raw) as ListaItem[] : [];
    } catch (e) {
      return [];
    }
  }

  // Método para guardar los elementos de una lista para el usuario actual
  private saveListItems(id: string, items: ListaItem[]): void {
    localStorage.setItem(this.listKey(id), JSON.stringify(items));
    const meta = this.index.lists.find(l => l.id === id);
    if (meta) {
      meta.modified = Date.now();
      this.saveIndex();
    }
  }

  // Método para refrescar la lista para el usuario actual
  getLists(): ListaMeta[] {
    return [...this.index.lists];
  }

  // Método para crear una nueva lista para el usuario actual
  createList(name: string): string {
    const id = `l${Date.now()}`;
    const meta: ListaMeta = { id, name, created: Date.now() };
    this.index.lists.push(meta);
    this.saveIndex();
    this.saveListItems(id, []);
    return id;
  }

  // Método para eliminar una lista para el usuario actual
  deleteList(id: string): void {
    this.index.lists = this.index.lists.filter(l => l.id !== id);
    localStorage.removeItem(this.listKey(id));
    if (this.index.activeId === id) {
      this.index.activeId = this.index.lists.length ? this.index.lists[0].id : undefined;
    }
    this.saveIndex();
  }

  // Método para renombrar una lista para el usuario actual
  renameList(id: string, name: string): void {
    const meta = this.index.lists.find(l => l.id === id);
    if (meta) {
      meta.name = name;
      meta.modified = Date.now();
      this.saveIndex();
    }
  }

  // Método para establecer la lista activa para el usuario actual
  setActiveList(id: string | undefined): void {
    this.index.activeId = id;
    this.saveIndex();
  }

  // Método para obtener el ID de la lista activa para el usuario actual
  getActiveListId(): string | undefined {
    return this.index.activeId;
  }

  // Método para obtener los elementos de una lista para el usuario actual
  getItems(listId?: string): ListaItem[] {
    const id = listId ?? this.index.activeId;
    if (!id) return [];
    return this.loadListItems(id);
  }

  // Método para agregar un producto a una lista para el usuario actual
  addProducto(producto: ProductoSupermercado, cantidad = 1, listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    const items = this.loadListItems(id);
    const existing = items.find(i => i.producto.id === producto.id);
    if (existing) {
      existing.cantidad += cantidad;
    } else {
      items.push({ producto, cantidad });
    }
    this.saveListItems(id, items);
  }

  // Método para eliminar un producto de una lista para el usuario actual
  removeProducto(productoId: number, listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    let items = this.loadListItems(id);
    items = items.filter(i => i.producto.id !== productoId);
    this.saveListItems(id, items);
  }

  // Método para actualizar la cantidad de un producto en una lista para el usuario actual
  updateCantidad(productoId: number, cantidad: number, listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    const items = this.loadListItems(id);
    const it = items.find(i => i.producto.id === productoId);
    if (it) {
      it.cantidad = cantidad;
      if (it.cantidad <= 0) {
        this.removeProducto(productoId, id);
      } else {
        this.saveListItems(id, items);
      }
    }
  }

  // Método para vaciar una lista para el usuario actual
  clear(listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    this.saveListItems(id, []);
  }

  // Método para obtener el recuento total de elementos en una lista para el usuario actual
  getTotalCount(listId?: string): number {
    const items = this.getItems(listId);
    return items.reduce((s, i) => s + i.cantidad, 0);
  }

  // Método para migrar la lista antigua de un solo elemento a la nueva estructura de listas múltiples
  private migrateOldSingleList(): void {
    try {
      const raw = localStorage.getItem('lista_compra');
      if (!raw) return;
      const existing = JSON.parse(raw) as ListaItem[];
      const id = this.createList('Principal');
      this.saveListItems(id, existing);
      localStorage.removeItem('lista_compra');
      this.setActiveList(id);
    } catch (e) {
      // ignore
    }
  }
}
