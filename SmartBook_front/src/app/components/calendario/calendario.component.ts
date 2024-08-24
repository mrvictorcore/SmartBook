import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  calendario: string = '';

  ngOnInit(): void {
    this.generarCalendario();
  }

  generarCalendario(): void {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();

    let html = `<h3>${hoy.toLocaleString('default', { month: 'long' })} ${anio}</h3>`;
    html += '<table><tr><th>Dom</th><th>Lun</th><th>Mar</th><th>Mié</th><th>Jue</th><th>Vie</th><th>Sáb</th></tr>';

    let dia = 1;
    for (let i = 0; i < 6; i++) {
      html += '<tr>';
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < new Date(anio, mes, 1).getDay()) {
          html += '<td></td>';
        } else if (dia > diasEnMes) {
          html += '<td></td>';
        } else {
          html += `<td>${dia}</td>`;
          dia++;
        }
      }
      html += '</tr>';
      if (dia > diasEnMes) break;
    }
    html += '</table>';

    this.calendario = html;
  }
}
