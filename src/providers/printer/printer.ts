import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/*
  Generated class for the PrinterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrinterProvider {

  constructor(private bluetoothSerial: BluetoothSerial) {
    console.log('Hello PrinterProvider Provider');
  }

  habilitarBluetooth() {
    return this.bluetoothSerial.enable();
  }

  buscarBluetooth() {
    return this.bluetoothSerial.list();
  }

  conectarBluetooth(address) {
    return this.bluetoothSerial.connect(address);
  }

  printData(data) {
    return this.bluetoothSerial.write(data);
  }

  desconectarBluetooth() {
    return this.bluetoothSerial.disconnect();
  }

}
