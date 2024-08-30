import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotebookComponent } from './notebook.component';
import { AuthGuard } from '../auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NotebookComponent,
    children: [
      { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
      { 
        path: 'auth', 
        loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule) 
      },
      {
        path: 'lista-compra',
        loadChildren: () => import('../lista-compra/lista-compra.module').then(m => m.ListaCompraModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cartera',
        loadChildren: () => import('../cartera/cartera.module').then(m => m.CarteraModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'notas',
        loadChildren: () => import('../notas/notas.module').then(m => m.NotasModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'calendario',
        loadChildren: () => import('../calendario/calendario.module').then(m => m.CalendarioModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'recordatorios',
        loadChildren: () => import('../recordatorios/recordatorios.module').then(m => m.RecordatoriosModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'presupuesto',
        loadChildren: () => import('../presupuesto/presupuesto.module').then(m => m.PresupuestoModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'objetivos',
        loadChildren: () => import('../objetivos/objetivos.module').then(m => m.ObjetivosModule),
        canActivate: [AuthGuard]
      },
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotebookRoutingModule { }
