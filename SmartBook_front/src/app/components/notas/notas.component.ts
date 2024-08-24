import { Component } from '@angular/core';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.component.html',
  styleUrls: ['./notas.component.css']
})
export class NotasComponent {
  notas: string = '';
  listaNotas: { texto: string }[] = [];

  guardarNotas(): void {
    if (this.notas.trim()) {
      this.listaNotas.push({ texto: this.notas.trim() });
      this.notas = '';
    }
  }

  eliminarNota(index: number): void {
    this.listaNotas.splice(index, 1);
  }
}
