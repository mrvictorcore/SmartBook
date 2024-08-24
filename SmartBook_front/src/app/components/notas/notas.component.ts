import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent {
  notasForm: FormGroup;
  listaNotas: { texto: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.notasForm = this.fb.group({
      notas: ['', Validators.required]
    });
  }

  guardarNotas(): void {
    if (this.notasForm.valid) {
      this.listaNotas.push({ texto: this.notasForm.value.notas.trim() });
      this.notasForm.reset();
    }
  }

  eliminarNota(index: number): void {
    this.listaNotas.splice(index, 1);
  }
}
