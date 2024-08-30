import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

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
    const loggedIn = this.isAuthenticated || !!localStorage.getItem('authToken');
    console.log('AuthService.isLoggedIn:', loggedIn);
    return loggedIn;
  }
}
