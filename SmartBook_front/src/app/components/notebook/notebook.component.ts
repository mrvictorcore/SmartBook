import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TabStateService } from './tab-state.service';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent {
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tabStateService: TabStateService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.router.navigate(['/notebook/lista-compra']);
      this.tabStateService.setCurrentTab('ListaCompra');
    } else {
      this.router.navigate(['/login']);
      this.tabStateService.setCurrentTab('Login');
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.tabStateService.setCurrentTab('Login');
    this.router.navigate(['/login']);
  }

  get currentTab(): string {
    return this.tabStateService.getCurrentTab();
  }

  setCurrentTab(tabName: string): void {
    this.tabStateService.setCurrentTab(tabName);
  }
}
