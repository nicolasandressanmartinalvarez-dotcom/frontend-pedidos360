import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-cliente-compra',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cliente-compra.html'
})
export class ClienteCompraComponent implements OnInit {
    productos: any[] = [];
    mensajeExito: string = '';
    errorMessage: string = '';

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef // 1. Inyectamos ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.cargarProductos();
    }

    // Carga el catálogo de productos desde el BFF
    cargarProductos(): void {
        const apiUrl = `${environment.apiUrl}/api/productos`;
        console.log('Intentando conectar a:', apiUrl);

        this.http.get<any[]>(apiUrl).subscribe({
            next: (data) => {
                console.log('Datos de productos obtenidos con éxito:', data);
                this.productos = data || [];
                this.cdr.detectChanges(); // 2. Forzamos a Angular a actualizar la vista
            },
            error: (err) => {
                console.error('Error detallado al conectar con el BFF:', err);
                this.errorMessage = `Error ${err.status}: No se pudo conectar con el catálogo en ${apiUrl}`;
                this.cdr.detectChanges(); // 3. Actualizamos la vista también en caso de error
            }
        });
    }

    // Acción para comprar el producto seleccionado
    comprarProducto(producto: any): void {
        const nuevoPedido = {
            username: "nicolas.cliente",
            estado: "CREADO",
            total: producto.precio || producto.price,
            detalles: [
                {
                    productoId: producto.id,
                    cantidad: 1,
                    precioUnitario: producto.precio || producto.price
                }
            ]
        };

        const apiUrl = `${environment.apiUrl}/api/pedidos`;
        this.http.post(apiUrl, nuevoPedido).subscribe({
            next: (res) => {
                this.mensajeExito = `¡Compra realizada con éxito para: ${producto.nombre || producto.name}!`;
                this.errorMessage = '';
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.mensajeExito = '';
                    this.cdr.detectChanges();
                }, 4000);
            },
            error: (err) => {
                console.error('Error al procesar la compra:', err);
                this.errorMessage = 'Hubo un error al procesar tu compra.';
                this.cdr.detectChanges();
            }
        });
    }
}