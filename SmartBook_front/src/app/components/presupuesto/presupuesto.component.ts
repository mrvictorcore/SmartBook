import { Component } from '@angular/core';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent {
  categoriaInput: string = '';
  limiteInput: number = 0;
  categorias: { nombre: string, limite: number }[] = [];

  agregarCategoria(): void {
    if (this.categoriaInput && this.limiteInput > 0) {
      this.categorias.push({ nombre: this.categoriaInput, limite: this.limiteInput });
      this.categoriaInput = '';
      this.limiteInput = 0;
    }
  }

  eliminarCategoria(index: number): void {
    this.categorias.splice(index, 1);
  }
}
