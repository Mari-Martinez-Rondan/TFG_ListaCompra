import { Routes } from '@angular/router';
import { MainLayout } from './layouts/mainlayout/mainlayout';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';
import { listaDeCompraPages } from './features/listadecompra/listadecompra';
import { PerfilComponent } from './features/usuarios/pages/perfil/perfil';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // público
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

  // protegido
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      ...listaDeCompraPages,
      { path: 'perfil', component: PerfilComponent },
    ],
  },

  // redirección inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // fallback
  { path: '**', redirectTo: '/login' }
];
