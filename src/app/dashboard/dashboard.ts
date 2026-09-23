import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  nombreUsuario: string = '';
  rolesUsuario: string[] = [];
  mensajeBff: string = 'Conectando con el servidor...';
  productos: any[] = [];
  pedidos: any[] = [];

  constructor(
    private authService: MsalService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const cuenta = this.authService.instance.getActiveAccount();
    if (cuenta) {
      this.nombreUsuario = cuenta.name || 'Usuario';

      // Buscamos los roles dentro de los "claims" del token de Azure
      if (cuenta.idTokenClaims && cuenta.idTokenClaims['roles']) {
        this.rolesUsuario = cuenta.idTokenClaims['roles'] as string[];
      } else {
        this.rolesUsuario = ['Sin roles asignados'];
      }
    }

    // Hacemos la petición al BFF usando la IP de AWS desde el environment
    if (isPlatformBrowser(this.platformId)) {
      this.http.get<any>(`${environment.apiUrl}/api/productos`).subscribe({
        next: (respuesta) => {
          console.log('PRODUCTOS DESDE EL BFF:', respuesta);
          this.productos = respuesta;
          this.mensajeBff = '¡Productos cargados exitosamente!';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
          this.mensajeBff = 'Error al conectar';
          this.cdr.detectChanges();
        }
      });
      this.http.get<any>(`${environment.apiUrl}/api/pedidos`).subscribe({
        next: (respuesta) => {
          console.log('PEDIDOS DESDE EL BFF:', respuesta);
          this.pedidos = respuesta;
          this.mensajeBff = '¡Pedidos cargados exitosamente!';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
          this.mensajeBff = 'Error al conectar';
          this.cdr.detectChanges();
        }
      });
    }
  }
  isAdmin(): boolean {
    return this.rolesUsuario.includes('ROLE_ADMINISTRADOR') || this.rolesUsuario.includes('Admin');
  }

  isOperador(): boolean {
    return this.rolesUsuario.includes('ROLE_OPERADOR') || this.rolesUsuario.includes('Operador');
  }

  isCliente(): boolean {
    return this.rolesUsuario.includes('ROLE_CLIENTE') || this.rolesUsuario.includes('Cliente');
  }
  cerrarSesion() {
    this.authService.logoutRedirect();
  }
}