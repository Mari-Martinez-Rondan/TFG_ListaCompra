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

  private getIndexKey(): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.indexKeyBase}_${user}`;
  }

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

  private saveIndex(): void {
    const userKey = this.getIndexKey();
    localStorage.setItem(userKey, JSON.stringify(this.index));
  }

  private listKey(id: string): string {
    const user = this.tokenService.getUsername() ?? 'anon';
    return `${this.listPrefix}${id}_${user}`;
  }

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

  private saveListItems(id: string, items: ListaItem[]): void {
    localStorage.setItem(this.listKey(id), JSON.stringify(items));
    const meta = this.index.lists.find(l => l.id === id);
    if (meta) {
      meta.modified = Date.now();
      this.saveIndex();
    }
  }

  getLists(): ListaMeta[] {
    return [...this.index.lists];
  }

  createList(name: string): string {
    const id = `l${Date.now()}`;
    const meta: ListaMeta = { id, name, created: Date.now() };
    this.index.lists.push(meta);
    this.saveIndex();
    this.saveListItems(id, []);
    return id;
  }

  deleteList(id: string): void {
    this.index.lists = this.index.lists.filter(l => l.id !== id);
    localStorage.removeItem(this.listKey(id));
    if (this.index.activeId === id) {
      this.index.activeId = this.index.lists.length ? this.index.lists[0].id : undefined;
    }
    this.saveIndex();
  }

  renameList(id: string, name: string): void {
    const meta = this.index.lists.find(l => l.id === id);
    if (meta) {
      meta.name = name;
      meta.modified = Date.now();
      this.saveIndex();
    }
  }

  setActiveList(id: string | undefined): void {
    this.index.activeId = id;
    this.saveIndex();
  }

  getActiveListId(): string | undefined {
    return this.index.activeId;
  }

  getItems(listId?: string): ListaItem[] {
    const id = listId ?? this.index.activeId;
    if (!id) return [];
    return this.loadListItems(id);
  }

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

  removeProducto(productoId: number, listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    let items = this.loadListItems(id);
    items = items.filter(i => i.producto.id !== productoId);
    this.saveListItems(id, items);
  }

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

  clear(listId?: string): void {
    const id = listId ?? this.index.activeId;
    if (!id) return;
    this.saveListItems(id, []);
  }

  getTotalCount(listId?: string): number {
    const items = this.getItems(listId);
    return items.reduce((s, i) => s + i.cantidad, 0);
  }

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
