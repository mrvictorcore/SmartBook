import { Routes } from '@angular/router';
import { NotebookComponent } from './components/notebook/notebook.component';
import { ListaCompraComponent } from './components/lista-compra/lista-compra.component';
import { CarteraComponent } from './components/cartera/cartera.component';
import { NotasComponent } from './components/notas/notas.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { RecordatoriosComponent } from './components/recordatorios/recordatorios.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { ObjetivosComponent } from './components/objetivos/objetivos.component';

export const routes: Routes = [
  { path: '', component: NotebookComponent },
  { path: 'lista-compra', component: ListaCompraComponent },
  { path: 'cartera', component: CarteraComponent },
  { path: 'notas', component: NotasComponent },
  { path: 'calendario', component: CalendarioComponent },
  { path: 'recordatorios', component: RecordatoriosComponent },
  { path: 'presupuesto', component: PresupuestoComponent },
  { path: 'objetivos', component: ObjetivosComponent },
];
