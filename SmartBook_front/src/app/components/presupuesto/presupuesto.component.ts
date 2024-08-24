import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent {
  presupuestoForm: FormGroup;
  categorias: { nombre: string, limite: number }[] = [];

  constructor(private fb: FormBuilder) {
    this.presupuestoForm = this.fb.group({
      categoriaInput: ['', Validators.required],
      limiteInput: [0, [Validators.required, Validators.min(1)]]
    });
  }

  agregarCategoria(): void {
    if (this.presupuestoForm.valid) {
      this.categorias.push({
        nombre: this.presupuestoForm.value.categoriaInput,
        limite: this.presupuestoForm.value.limiteInput
      });
      this.presupuestoForm.reset();
    }
  }

  eliminarCategoria(index: number): void {
    this.categorias.splice(index, 1);
  }
}
