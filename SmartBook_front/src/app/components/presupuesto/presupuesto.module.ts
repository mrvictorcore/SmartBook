import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PresupuestoRoutingModule } from './presupuesto.routing.module';

// Componentes
import { PresupuestoComponent } from './presupuesto.component';

@NgModule({
  declarations: [PresupuestoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PresupuestoRoutingModule
  ]
})
export class PresupuestoModule { }
