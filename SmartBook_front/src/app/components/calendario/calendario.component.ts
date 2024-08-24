import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  mesActual: string = '';
  anioActual: number = 0;
  calendarioDias: number[][] = [];

  ngOnInit(): void {
    this.generarCalendario();
  }

  generarCalendario(): void {
    const hoy = new Date();
    const mes = hoy.getMonth();
    const anio = hoy.getFullYear();
    this.mesActual = hoy.toLocaleString('default', { month: 'long' });
    this.anioActual = anio;

    const primerDiaMes = new Date(anio, mes, 1).getDay();
    const diasEnMes = new Date(anio, mes + 1, 0).getDate();

    let dia = 1;
    this.calendarioDias = [];

    for (let i = 0; i < 6; i++) {
      const semana: number[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < primerDiaMes) {
          semana.push(0); // Días vacíos antes del inicio del mes
        } else if (dia > diasEnMes) {
          semana.push(0); // Días vacíos después del final del mes
        } else {
          semana.push(dia);
          dia++;
        }
      }
      this.calendarioDias.push(semana);
    }
  }
}
