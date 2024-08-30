import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/notebook', pathMatch: 'full' },
  { path: 'notebook', loadChildren: () => import('./components/notebook/notebook.module').then(m => m.NotebookModule) },
  { path: '**', redirectTo: '/notebook/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
