import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { ObjetivosComponent } from './objetivos.component';

const routes: Routes = [
  { path: '', component: ObjetivosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjetivosRoutingModule { }
