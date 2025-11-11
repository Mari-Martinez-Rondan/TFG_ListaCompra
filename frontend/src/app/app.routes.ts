import { Routes } from '@angular/router';
import { MainLayout } from './layouts/mainlayout/mainlayout';
import { AuthLayout } from './layouts/authlayout/authlayout';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';
import { listaDeCompraPages } from './features/listadecompra/listadecompra';
import { PerfilComponent } from './features/usuarios/pages/perfil/perfil';


export const routes: Routes = [
   {
    path: '',
    component: AuthLayout,
    children: [
        {path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent }
    ]
   },
   {
    path: '',
    component: MainLayout,
    children: [
        ...listaDeCompraPages,
        { path: 'perfil', component: PerfilComponent },
        { path: '', redirectTo: 'lista', pathMatch: 'full' }
    ]
   }
];
