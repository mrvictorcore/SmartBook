import { Routes } from '@angular/router';
import { NotebookComponent } from './components/notebook/notebook.component';
import { ListaCompraComponent } from './components/lista-compra/lista-compra.component';
import { CarteraComponent } from './components/cartera/cartera.component';
import { NotasComponent } from './components/notas/notas.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { RecordatoriosComponent } from './components/recordatorios/recordatorios.component';
import { PresupuestoComponent } from './components/presupuesto/presupuesto.component';
import { ObjetivosComponent } from './components/objetivos/objetivos.component';
import { AuthGuard } from './components/auth/guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarPasswordComponent } from './components/auth/recuperar-password/recuperar-password.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { VerificarEmailComponent } from './components/auth/verificar-email/verificar-email.component';

export const routes: Routes = [
  {
    path: '', component: NotebookComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: 'recuperar-password', component: RecuperarPasswordComponent },
      { path: 'verificar-email', component: VerificarEmailComponent },
      
      // Rutas protegidas, solo accesibles si el usuario está logueado
      { 
        path: 'notebook', 
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'lista-compra', pathMatch: 'full' },
          { path: 'lista-compra', component: ListaCompraComponent },
          { path: 'cartera', component: CarteraComponent },
          { path: 'notas', component: NotasComponent },
          { path: 'calendario', component: CalendarioComponent },
          { path: 'recordatorios', component: RecordatoriosComponent },
          { path: 'presupuesto', component: PresupuestoComponent },
          { path: 'objetivos', component: ObjetivosComponent },
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
