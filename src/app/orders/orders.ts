import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // Método para cargar los pedidos desde el BFF (según el rol del usuario)
  loadOrders(): void {
    const apiUrl = `${environment.apiUrl}/api/pedidos`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.errorMessage = 'No se pudieron cargar los pedidos.';
      }
    });
  }

  // Método para simular la creación de un nuevo pedido (Rol Cliente)
  crearNuevoPedido(): void {
    const nuevoPedido = {
      username: "cliente_prueba",
      estado: "CREADO",
      total: 1850.0,
      detalles: []
    };

    const apiUrl = `${environment.apiUrl}/api/pedidos`;
    this.http.post(apiUrl, nuevoPedido).subscribe({
      next: (res) => {
        console.log('Pedido creado con éxito:', res);
        this.loadOrders(); // Recargamos la tabla
      },
      error: (err) => {
        console.error('Error al crear pedido:', err);
      }
    });
  }

  // Método para cambiar el estado (Rol Operador - Regla de negocio)
  cambiarEstado(id: number, nuevoEstado: string): void {
    const apiUrl = `${environment.apiUrl}/api/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`;
    this.http.put(apiUrl, {}).subscribe({
      next: () => { this.loadOrders(); },
      error: (err) => { console.error('Error al cambiar estado:', err); }
    });
  }
}