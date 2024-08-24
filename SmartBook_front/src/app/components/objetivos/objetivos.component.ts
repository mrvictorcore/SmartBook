import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent {
  objetivosForm: FormGroup;
  objetivos: { nombre: string, monto: number }[] = [];

  constructor(private fb: FormBuilder) {
    this.objetivosForm = this.fb.group({
      objetivoInput: ['', Validators.required],
      montoObjetivoInput: [0, [Validators.required, Validators.min(1)]]
    });
  }

  agregarObjetivo(): void {
    if (this.objetivosForm.valid) {
      this.objetivos.push({
        nombre: this.objetivosForm.value.objetivoInput,
        monto: this.objetivosForm.value.montoObjetivoInput
      });
      this.objetivosForm.reset();
    }
  }

  eliminarObjetivo(index: number): void {
    this.objetivos.splice(index, 1);
  }
}
