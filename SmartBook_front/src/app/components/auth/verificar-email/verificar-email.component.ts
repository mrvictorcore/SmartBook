import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabStateService } from '../../notebook/tab-state.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.component.html',
  styleUrls: ['./verificar-email.component.css']
})
export class VerificarEmailComponent {
  verificarTokenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tabStateService: TabStateService
  ) {
    this.verificarTokenForm = this.fb.group({
      token: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.verificarTokenForm.valid) {
      console.log('Intento de verificación de token', this.verificarTokenForm.value);
    }
  }

  openTab(tabName: string) {
    this.tabStateService.setCurrentTab(tabName);
  }

  get currentTab(): string {
    return this.tabStateService.getCurrentTab(); 
  }
}
