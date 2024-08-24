import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cartera',
  templateUrl: './cartera.component.html',
  styleUrls: ['./cartera.component.css']
})
export class CarteraComponent {
  saldo: number = 0;
  transacciones: { fecha: string, tipo: string, monto: number }[] = [];
  carteraForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.carteraForm = this.fb.group({
      montoInput: [0, [Validators.required, Validators.min(1)]]
    });
  }

  agregarFondos(): void {
    const monto = this.carteraForm.value.montoInput;
    if (monto > 0) {
      this.saldo += monto;
      this.registrarTransaccion('Ingreso', monto);
      this.carteraForm.reset();
    }
  }

  registrarGasto(): void {
    const monto = this.carteraForm.value.montoInput;
    if (monto > 0 && monto <= this.saldo) {
      this.saldo -= monto;
      this.registrarTransaccion('Gasto', -monto);
      this.carteraForm.reset();
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
