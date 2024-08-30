import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarioRoutingModule } from './calendario.routing.module';

// Componentes
import { CalendarioComponent } from './calendario.component';

@NgModule({
  declarations: [CalendarioComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarioRoutingModule
  ]
})
export class CalendarioModule { }
