import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecordatoriosRoutingModule } from './recordatorios.routing.module';

// Componentes
import { RecordatoriosComponent } from './recordatorios.component';

@NgModule({
  declarations: [RecordatoriosComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecordatoriosRoutingModule
  ]
})
export class RecordatoriosModule { }
