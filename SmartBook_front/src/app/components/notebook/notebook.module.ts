import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotebookRoutingModule } from './notebook.routing.module';

// Componentes
import { NotebookComponent } from './notebook.component';

@NgModule({
  declarations: [NotebookComponent],
  imports: [
    CommonModule,
    RouterModule,
    NotebookRoutingModule
  ]
})
export class NotebookModule { }
