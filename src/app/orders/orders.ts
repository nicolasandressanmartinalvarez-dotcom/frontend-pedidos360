import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Inyectamos ChangeDetectorRef para refrescar la vista 🔄
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  // Método para cargar los pedidos desde el BFF 📋
  loadOrders(): void {
    const apiUrl = `${environment.apiUrl}/api/pedidos`;
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        console.log('Pedidos cargados exitosamente:', data);
        this.orders = data || [];
        this.errorMessage = '';
        this.cdr.detectChanges(); // Forzamos la actualización de la tabla
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.errorMessage = 'No se pudieron cargar los pedidos.';
        this.cdr.detectChanges();
      }
    });
  }
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
        this.loadOrders(); // Recargamos la tabla automáticamente
      },
      error: (err) => {
        console.error('Error al crear pedido:', err);
        this.errorMessage = 'Error al crear el nuevo pedido.';
        this.cdr.detectChanges();
      }
    });
  }

  // Método para cambiar el estado (Rol Operador) ⚙️
  cambiarEstado(id: number, nuevoEstado: string): void {
    const apiUrl = `${environment.apiUrl}/api/pedidos/${id}/estado?nuevoEstado=${nuevoEstado}`;
    this.http.put(apiUrl, {}).subscribe({
      next: () => { 
        this.loadOrders(); // Refrescamos la lista al cambiar el estado
      },
      error: (err) => { 
        console.error('Error al cambiar estado:', err); 
      }
    });
  }
}