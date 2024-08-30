import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { ListaCompraComponent } from './lista-compra.component';

const routes: Routes = [
  { path: '', component: ListaCompraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListaCompraRoutingModule { }
