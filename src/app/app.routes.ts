import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { OrdersComponent } from './orders/orders';
import { CatalogComponent } from './catalog/catalog';
import { ClienteCompraComponent } from './cliente-compra/cliente-compra';
import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [MsalGuard] },
    { path: 'orders', component: OrdersComponent, canActivate: [MsalGuard] },
    { path: 'catalog', component: CatalogComponent, canActivate: [MsalGuard] },
    {path: 'cliente-compra', component: ClienteCompraComponent, canActivate: [MsalGuard]},
    { path: '**', redirectTo: '' }
];
