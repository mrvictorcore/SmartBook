import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { TabStateService } from './services/tab-state.service';
import { Router } from '@angular/router';

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
      this.router.navigate(['/notebook/login']);
      this.tabStateService.setCurrentTab('Login');
    }
  }

  setCurrentTab(tabName: string): void {
    this.tabStateService.setCurrentTab(tabName);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.setCurrentTab('Login');
    this.router.navigate(['/notebook/auth/login']);
  }

  get currentTab(): string {
    return this.tabStateService.getCurrentTab();
  }
}
