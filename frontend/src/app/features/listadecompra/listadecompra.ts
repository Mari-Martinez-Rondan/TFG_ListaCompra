import { ListaViewComponent } from "./pages/listaview/listaview";
import { EditarListaComponent } from "./pages/editarlista/editarlista";
import { DetallesProductoComponent } from "./pages/detallesproducto/detallesproducto";
import { Routes } from "@angular/router";

export const listaDeCompraPages: Routes = [
    { path: 'lista', component: ListaViewComponent },
    { path: 'editar-lista/:id', component: EditarListaComponent },
    { path: 'detalles-producto/:id', component: DetallesProductoComponent }
];