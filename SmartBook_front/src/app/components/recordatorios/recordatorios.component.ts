import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.css']
})
export class RecordatoriosComponent {
  recordatoriosForm: FormGroup;
  recordatorios: { texto: string, fecha: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.recordatoriosForm = this.fb.group({
      recordatorioInput: ['', Validators.required],
      fechaRecordatorio: ['', Validators.required]
    });
  }

  agregarRecordatorio(): void {
    if (this.recordatoriosForm.valid) {
      this.recordatorios.push({
        texto: this.recordatoriosForm.value.recordatorioInput,
        fecha: this.recordatoriosForm.value.fechaRecordatorio
      });
      this.recordatoriosForm.reset();
    }
  }

  eliminarRecordatorio(index: number): void {
    this.recordatorios.splice(index, 1);
  }
}
