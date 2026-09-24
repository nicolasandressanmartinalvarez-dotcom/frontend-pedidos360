import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { OrdersComponent } from './orders/orders';
import { CatalogComponent } from './catalog/catalog';
import { ClienteCompraComponent } from './cliente-compra/cliente-compra';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
    {
        path: 'orders', 
        component: OrdersComponent, 
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR', 'Admin', 'ROLE_OPERADOR', 'Operador'] } 
    },
    { 
        path: 'catalog', 
        component: CatalogComponent, 
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['ROLE_ADMINISTRADOR', 'Admin', 'ROLE_OPERADOR', 'Operador'] }
    },
    { 
        path: 'cliente-compra', 
        component: ClienteCompraComponent, 
        canActivate: [MsalGuard, roleGuard],
        data: { roles: ['ROLE_CLIENTE', 'Cliente', 'ROLE_ADMINISTRADOR', 'Admin','Operador','ROLE_OPERADOR'] }
    },

    { path: '**', redirectTo: '' }
];