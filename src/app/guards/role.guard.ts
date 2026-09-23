import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const roleGuard: CanActivateFn = (route, state) => {
    const msalService = inject(MsalService);
    const router = inject(Router);

    const accounts = msalService.instance.getAllAccounts();
    if (accounts.length === 0) {
        router.navigate(['']);
        return false;
    }

    const account = accounts[0];
    const userRoles: string[] = (account.idTokenClaims && (account.idTokenClaims as any)['roles']) || [];
    
    // Obtenemos los roles permitidos definidos en las rutas (app.routes.ts)
    const allowedRoles = route.data?.['roles'] as Array<string>;

    // Si la ruta no requiere roles específicos, se permite el acceso
    if (!allowedRoles || allowedRoles.length === 0) {
        return true;
    }

    // Verificamos de forma flexible si el usuario posee alguno de los roles permitidos
    const hasPermission = userRoles.some(userRole => 
        allowedRoles.some(allowed => 
        userRole.toUpperCase() === allowed.toUpperCase() ||
        userRole.toLowerCase() === allowed.toLowerCase()
        )
    );

    if (hasPermission) {
        return true;
    }

    // Si no tiene el rol, se le deniega el acceso y se redirige al dashboard
    alert('Acceso denegado: No tienes el rol necesario para acceder a esta sección.');
    router.navigate(['/dashboard']);
    return false;
};