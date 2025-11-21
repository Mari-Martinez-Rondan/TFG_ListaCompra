import { Routes } from '@angular/router';
import { MainLayout } from './layouts/mainlayout/mainlayout';
import { authGuard } from './core/guards/auth.guard';

// Páginas principales
import { PerfilComponent } from './features/usuarios/pages/perfil/perfil';
import { listaDeCompraPages } from './features/listadecompra/listadecompra';

// Nuevas páginas de productos
import { ListadoProductosComponent } from './features/productos/pages/listadoProductos';
import { ComparadorComponent } from './features/productos/pages/comparador/comparador';

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/pages/register/register').then(m => m.RegisterComponent),
  },

  // --- RUTAS PROTEGIDAS ---
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      ...listaDeCompraPages,

      { path: 'perfil', component: PerfilComponent },

      // --- NUEVAS RUTAS DE PRODUCTOS ---
      { path: 'productos', component: ListadoProductosComponent },
      { path: 'comparador', component: ComparadorComponent },
    ],
  },

  // Redirección inicial SIEMPRE al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
