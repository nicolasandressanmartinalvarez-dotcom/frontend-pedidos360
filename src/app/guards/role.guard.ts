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

    const claims: any = accounts[0].idTokenClaims;
    const userRoles: string[] = claims?.roles || [];
    const allowedRoles = route.data?.['roles'] as Array<string>;

    if (!allowedRoles) {
        return true;
    }

    // Comprobación flexible de roles
    const hasPermission = allowedRoles.some(role => userRoles.includes(role));

    if (hasPermission) {
        return true;
    }

    alert('No tienes permisos para acceder a esta sección.');
    router.navigate(['/dashboard']);
    return false;
};