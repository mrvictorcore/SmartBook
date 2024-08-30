import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NotasRoutingModule } from './notas.routing.module';

// Componentes
import { NotasComponent } from './notas.component';

@NgModule({
  declarations: [NotasComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotasRoutingModule
  ]
})
export class NotasModule { }
