import { Component } from '@angular/core';

@Component({
  selector: 'app-lista-compra',
  templateUrl: './lista-compra.component.html',
  styleUrls: ['./lista-compra.component.css']
})
export class ListaCompraComponent {
  listaCompra: string[] = [];
  itemInput: string = '';

  agregarItem(): void {
    if (this.itemInput.trim()) {
      this.listaCompra.push(this.itemInput.trim());
      this.itemInput = '';
    }
  }

  eliminarItem(index: number): void {
    this.listaCompra.splice(index, 1);
  }
}
