import { ListaViewComponent } from "./pages/listaview/listaview";
import { EditarListaComponent } from "./pages/editarlista/editarlista";
import { DetallesProductoComponent } from "./pages/detallesproducto/detallesproducto";

export const listaDeCompraPages = [
    { path: 'lista', component: ListaViewComponent },
    { path: 'editar-lista/:id', component: EditarListaComponent },
    { path: 'detalles-producto/:id', component: DetallesProductoComponent }
];