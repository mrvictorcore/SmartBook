import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ObjetivosRoutingModule } from './objetivos.routing.module';

// Componentes
import { ObjetivosComponent } from './objetivos.component';

@NgModule({
  declarations: [ObjetivosComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ObjetivosRoutingModule
  ]
})
export class ObjetivosModule { }
