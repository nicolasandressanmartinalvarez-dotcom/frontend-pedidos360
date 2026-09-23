import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private msalService: MsalService) {}

  getUserRoles(): string[] {
    const accounts = this.msalService.instance.getAllAccounts();
    if (accounts.length === 0) return [];

    const claims: any = accounts[0].idTokenClaims;
    return claims?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }
}