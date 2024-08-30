import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { CarteraComponent } from './cartera.component';

const routes: Routes = [
  { path: '', component: CarteraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteraRoutingModule { }
