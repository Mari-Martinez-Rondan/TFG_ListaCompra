import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import { ListaApiService } from '../../core/services/lista-api.service';
import { ProductoApiService } from '../../core/services/producto-api.service';
import { ListaService } from '../../core/services/lista.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent implements OnInit {
    totalListas: number = 0;
    totalProductos: number = 0;
    listasRecientes: any[] = [];

    constructor(private listaApiService: ListaApiService,
                private productoApi: ProductoApiService,
                private listaService: ListaService,
                private notificationService: NotificationService,
                private router: Router) {}

    ngOnInit(): void {
        this.cargarDatos();
    }

    // Cargar datos de inicio 
    cargarDatos(): void {
        this.listaApiService.obtenerMisListas().subscribe({
            next: (listas: any[]) => {
                this.totalListas = listas.length;
                this.listasRecientes = listas.slice(-3).reverse();

               //Total productos
                let total = 0;
                const needsFetch: any[] = [];
                for (const l of listas) {
                    if (Array.isArray(l.productos)) {
                        const sum = l.productos.reduce((s: number, p: any) => s + (p.cantidad || 0), 0);
                        l.productosCount = sum;
                        total += sum;
                    } else if (typeof l.productosCount === 'number') {
                        total += l.productosCount;
                    } else {
                        needsFetch.push(l);
                    }
                }

                if (needsFetch.length === 0) {
                    this.totalProductos = total;
                } else {
                    const calls = needsFetch.map(l => this.productoApi.obtenerProductosPorLista(Number(l.id)).toPromise());
                    Promise.all(calls).then(results => {
                        for (let i = 0; i < results.length; i++) {
                            const r = results[i] || [];
                            const sum = (r as any[]).reduce((s: number, p: any) => s + (p.cantidad || 0), 0);
                            needsFetch[i].productosCount = sum;
                            total += sum;
                        }
                        this.totalProductos = total;
                    }).catch(err => {
                        console.error('Error fetching products for counts fallback:', err);
                        this.totalProductos = total;
                    });
                }
            },
            error: (error) => {
                this.notificationService.show('Error al cargar las listas recientes');
            }
        });
    }

    // Crear lista rápida 
    crearListaRapida(): void {
        const nuevaLista = { nombre: 'Lista rápida ' + new Date().toLocaleString()};
        this.listaApiService.crearLista(nuevaLista.nombre).subscribe({
            next: (listaCreada: any) => {
                this.notificationService.show(String('Lista rápida creada con éxito'));
                this.router.navigate(['/listas', listaCreada.id]);
            },
            error: (error) => {
                this.notificationService.show('Error al crear la lista rápida');
            }
        });
    }

    // Ir a lista
    irALista(listaId: number): void {
        this.router.navigate(['/listas', listaId]);
    }

}