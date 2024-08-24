import { Component } from '@angular/core';

@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.css']
})
export class CarteraComponent {
  saldo: number = 0;
  montoInput: number = 0;
  transacciones: { fecha: string, tipo: string, monto: number }[] = [];

  agregarFondos(): void {
    if (this.montoInput > 0) {
      this.saldo += this.montoInput;
      this.registrarTransaccion('Ingreso', this.montoInput);
      this.montoInput = 0;
    }
  }

  registrarGasto(): void {
    if (this.montoInput > 0 && this.montoInput <= this.saldo) {
      this.saldo -= this.montoInput;
      this.registrarTransaccion('Gasto', -this.montoInput);
      this.montoInput = 0;
    } else {
      alert('Fondos insuficientes o monto inválido.');
    }
  }

  registrarTransaccion(tipo: string, monto: number): void {
    const fecha = new Date().toLocaleString();
    this.transacciones.push({ fecha, tipo, monto });
  }

  eliminarTransaccion(index: number): void {
    this.transacciones.splice(index, 1);
  }
}
