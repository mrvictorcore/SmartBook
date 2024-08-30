import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ListaCompraRoutingModule } from './lista-compra.routing.module';

// Componentes
import { ListaCompraComponent } from './lista-compra.component';

@NgModule({
  declarations: [ListaCompraComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ListaCompraRoutingModule
  ],
  exports: [
    ListaCompraComponent
  ]
})
export class ListaCompraModule { }
