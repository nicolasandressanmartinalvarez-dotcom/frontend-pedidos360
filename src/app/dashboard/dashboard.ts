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

  get isAdmin(): boolean {
    return this.rolesUsuario.some(r => r.toUpperCase().includes('ADMINISTRADOR') || r.toLowerCase() === 'admin');
  }

  get isOperador(): boolean {
    return this.rolesUsuario.some(r => r.toUpperCase().includes('OPERADOR'));
  }

  get isCliente(): boolean {
    return this.rolesUsuario.some(r => r.toUpperCase().includes('CLIENTE'));
  }

  ngOnInit(): void {
    const cuenta = this.authService.instance.getActiveAccount();
    if (cuenta) {
      this.nombreUsuario = cuenta.name || 'Usuario';

      if (cuenta.idTokenClaims && cuenta.idTokenClaims['roles']) {
        this.rolesUsuario = cuenta.idTokenClaims['roles'] as string[];
      } else {
        this.rolesUsuario = ['Sin roles asignados'];
      }
    }

    if (isPlatformBrowser(this.platformId)) {
      // Cargar Catálogo (permitido para todos los roles)
      this.http.get<any>(`${environment.apiUrl}/api/productos`).subscribe({
        next: (respuesta) => {
          this.productos = respuesta;
          this.mensajeBff = '¡Datos cargados exitosamente desde AWS!';
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
          this.mensajeBff = 'Error al conectar con el catálogo';
          this.cdr.detectChanges();
        }
      });

      // Cargar Pedidos
      this.http.get<any>(`${environment.apiUrl}/api/pedidos`).subscribe({
        next: (respuesta) => {
          if (this.isCliente) {
            // El cliente solo ve sus propios pedidos[cite: 18]
            this.pedidos = respuesta.filter((p: any) => p.username === this.nombreUsuario);
          } else {
            // Admin y Operador ven todos los pedidos[cite: 18]
            this.pedidos = respuesta;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('ERROR:', err);
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