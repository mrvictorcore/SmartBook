import { Component } from '@angular/core';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css']
})
export class ObjetivosComponent {
  objetivoInput: string = '';
  montoObjetivoInput: number = 0;
  objetivos: { nombre: string, monto: number }[] = [];

  agregarObjetivo(): void {
    if (this.objetivoInput && this.montoObjetivoInput > 0) {
      this.objetivos.push({ nombre: this.objetivoInput, monto: this.montoObjetivoInput });
      this.objetivoInput = '';
      this.montoObjetivoInput = 0;
    }
  }

  eliminarObjetivo(index: number): void {
    this.objetivos.splice(index, 1);
  }
}
