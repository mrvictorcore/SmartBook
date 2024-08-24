import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lista-compra',
  templateUrl: './lista-compra.component.html',
  styleUrls: ['./lista-compra.component.css']
})
export class ListaCompraComponent {
  listaCompra: string[] = [];
  listaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.listaForm = this.fb.group({
      itemInput: ['', Validators.required]
    });
  }

  agregarItem(): void {
    if (this.listaForm.valid) {
      this.listaCompra.push(this.listaForm.value.itemInput.trim());
      this.listaForm.reset();
    }
  }

  eliminarItem(index: number): void {
    this.listaCompra.splice(index, 1);
  }
}
