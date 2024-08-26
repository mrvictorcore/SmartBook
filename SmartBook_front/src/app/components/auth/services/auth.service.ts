import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = true;

  constructor() { }

  login(): void {
    this.isAuthenticated = true;
    localStorage.setItem('authToken', 'fake-jwt-token');
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('authToken');
  }
}
