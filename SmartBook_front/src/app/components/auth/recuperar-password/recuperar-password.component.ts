import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabStateService } from '../../notebook/services/tab-state.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent {
  recuperarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tabStateService: TabStateService
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.recuperarForm.valid) {
      console.log('Intento de recuperación de contraseña', this.recuperarForm.value);
    }
  }

  openTab(tabName: string) {
    this.tabStateService.setCurrentTab(tabName);
  }

  get currentTab(): string {
    return this.tabStateService.getCurrentTab(); 
  }
}
