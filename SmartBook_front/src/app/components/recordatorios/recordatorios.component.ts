import { Component } from '@angular/core';

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.css']
})
export class RecordatoriosComponent {
  recordatorioInput: string = '';
  fechaRecordatorio: string = '';
  recordatorios: { texto: string, fecha: string }[] = [];

  agregarRecordatorio(): void {
    if (this.recordatorioInput && this.fechaRecordatorio) {
      this.recordatorios.push({ texto: this.recordatorioInput, fecha: this.fechaRecordatorio });
      this.recordatorioInput = '';
      this.fechaRecordatorio = '';
    }
  }

  eliminarRecordatorio(index: number): void {
    this.recordatorios.splice(index, 1);
  }
}
