import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { NotebookComponent } from './components/notebook/notebook.component';
import { ListaCompraComponent } from './components/lista-compra/lista-compra.component';
import { CarteraComponent } from './components/cartera/cartera.component';
import { NotasComponent } from './components/notas/notas.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { RecordatoriosComponent } from './components/recordatorios/recordatorios.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { ObjetivosComponent } from './components/objetivos/objetivos.component';


@NgModule({
  declarations: [
    AppComponent,
    NotebookComponent,
    ListaCompraComponent,
    CarteraComponent,
    NotasComponent,
    CalendarioComponent,
    RecordatoriosComponent,
    PresupuestoComponent,
    ObjetivosComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
