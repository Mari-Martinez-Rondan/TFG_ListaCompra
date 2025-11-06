import { Routes } from '@angular/router';
import { MainLayout } from './layouts/mainlayout/mainlayout';
import { LoginComponent } from './features/auth/pages/login/login';
import { RegisterComponent } from './features/auth/pages/register/register';
import { ListaViewComponent } from './features/listadecompra/pages/listaview/listaview';
import { EditarListaComponent } from './features/listadecompra/pages/editarlista/editarlista';
import { DetallesProductoComponent } from './features/listadecompra/pages/detallesproducto/detallesproducto';
import { PerfilComponent } from './features/usuarios/pages/perfil/perfil';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }


    ,{path: '', component: MainLayout, children: [
        { path: 'lista', component: ListaViewComponent },
        { path: 'editar-lista/:id', component: EditarListaComponent },
        { path: 'detalles-producto/:id', component: DetallesProductoComponent },
        { path: 'perfil', component: PerfilComponent },
        { path: '', redirectTo: 'lista', pathMatch: 'full' }
    ] }
];
