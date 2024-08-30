import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabStateService } from '../../notebook/services/tab-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tabStateService: TabStateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Intento de inicio de sesión', this.loginForm.value);
    }
  }

  openTab(tabName: string) {
    this.tabStateService.setCurrentTab(tabName);
  }

  get currentTab(): string {
    return this.tabStateService.getCurrentTab(); 
  }
}
