import { Component } from '@angular/core';

@Component({
  selector: 'app-notebook',
  templateUrl: './notebook.component.html',
  styleUrls: ['./notebook.component.css']
})
export class NotebookComponent {
  currentTab: string = 'ListaCompra';

  openTab(tabName: string): void {
    this.currentTab = tabName;
  }
}
