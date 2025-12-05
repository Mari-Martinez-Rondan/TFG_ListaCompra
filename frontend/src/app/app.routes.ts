import { Routes } from '@angular/router';
import { MainLayout } from './layouts/mainlayout/mainlayout';
import { authGuard } from './core/guards/auth.guard';

// Páginas principales
import { PerfilComponent } from './features/usuarios/pages/perfil/perfil';
import { listaDeCompraPages } from './features/listadecompra/listadecompra';
import { InicioComponent } from './features/inicio/inicio';

// Páginas de productos
import { ListadoProductosComponent } from './features/productos/pages/listadoProductos';
import { ComparadorComponent } from './features/productos/pages/comparador/comparador';
import { FavoritosComponent } from './features/productos/pages/favoritos';


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
      // Ruta por defecto dentro del layout: redirige a inicio
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      { path: 'inicio', loadComponent: () => import('./features/inicio/inicio').then(m => m.InicioComponent) },
      
      ...listaDeCompraPages,

      { path: 'perfil', component: PerfilComponent },

      { path: 'productos', component: ListadoProductosComponent },
      { path: 'favoritos', component: FavoritosComponent },
      { path: 'comparador', component: ComparadorComponent }
    ],
  },

  // Fallback universal. Redirecciona al login
  { path: '**', redirectTo: 'login' },
];
