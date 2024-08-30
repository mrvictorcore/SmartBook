import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CarteraRoutingModule } from './cartera.routing.module';

// Componentes
import { CarteraComponent } from './cartera.component';

@NgModule({
  declarations: [CarteraComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CarteraRoutingModule
  ]
})
export class CarteraModule { }
