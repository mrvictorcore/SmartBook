import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
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
import { AuthGuard } from './components/auth/guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { RecuperarPasswordComponent } from './components/auth/recuperar-password/recuperar-password.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { VerificarEmailComponent } from './components/auth/verificar-email/verificar-email.component';

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
    LoginComponent,
    RecuperarPasswordComponent,
    RegistroComponent,
    VerificarEmailComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
