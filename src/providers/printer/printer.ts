import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the PrinterProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PrinterProvider {




  constructor(private bluetoothSerial: BluetoothSerial, private storage: Storage) {
    console.log('Hello PrinterProvider Provider');
  }



  /***********************************************************************************************/
  /**********************************GESTIÓN DE BLUETOOTH*****************************************/
  /***********************************************************************************************/
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

  estaConectado() {
    return this.bluetoothSerial.isConnected();
  }

  estaHabilitado() {
    return this.bluetoothSerial.isConnected();
  }


  /***********************************************************************************************/
  /**********************************GESTIÓN DE IMPRESIÓN*****************************************/
  /***********************************************************************************************/
  noSpecialChars(string) {
    var translate = {
      "à": "a",
      "á": "a",
      "â": "a",
      "ã": "a",
      "ä": "a",
      "å": "a",
      "æ": "a",
      "ç": "c",
      "è": "e",
      "é": "e",
      "ê": "e",
      "ë": "e",
      "ì": "i",
      "í": "i",
      "î": "i",
      "ï": "i",
      "ð": "d",
      "ñ": "n",
      "ò": "o",
      "ó": "o",
      "ô": "o",
      "õ": "o",
      "ö": "o",
      "ø": "o",
      "ù": "u",
      "ú": "u",
      "û": "u",
      "ü": "u",
      "ý": "y",
      "þ": "b",
      "ÿ": "y",
      "ŕ": "r",
      "À": "A",
      "Á": "A",
      "Â": "A",
      "Ã": "A",
      "Ä": "A",
      "Å": "A",
      "Æ": "A",
      "Ç": "C",
      "È": "E",
      "É": "E",
      "Ê": "E",
      "Ë": "E",
      "Ì": "I",
      "Í": "I",
      "Î": "I",
      "Ï": "I",
      "Ð": "D",
      "Ñ": "N",
      "Ò": "O",
      "Ó": "O",
      "Ô": "O",
      "Õ": "O",
      "Ö": "O",
      "Ø": "O",
      "Ù": "U",
      "Ú": "U",
      "Û": "U",
      "Ü": "U",
      "Ý": "Y",
      "Þ": "B",
      "Ÿ": "Y",
      "Ŕ": "R"
    },
      translate_re = /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþßàáâãäåæçèéêëìíîïðñòóôõöøùúûýýþÿŕŕÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÝÝÞŸŔŔ]/gim;
    return (string.replace(translate_re, function (match) {
      return translate[match];
    }));
  }


  public iniciarImpresion(receipt: string, alertCtrl: AlertController, loadCtrl: LoadingController, toastCtrl: ToastController) {
    this.storage.get("IMPRESORA_PRE").then((device) => {
      if (device) {
        this.estaHabilitado().then((exito) => {
          if (exito) {
            console.log("SI ESTÁ HABILITADO");
            this.imprimir(device, receipt, alertCtrl, loadCtrl);
          }
          else {
            console.log("NO ESTÁ HABILITADO");
            this.habilitandoImpresora(device, receipt, alertCtrl, loadCtrl);
          }
        }).catch((error) => {
          console.error("NO ESTÁ HABILITADO", error.message);
          this.habilitandoImpresora(device, receipt, alertCtrl, loadCtrl);
        });
      }
      else {
        this.seleccionarImpresora(receipt, alertCtrl, loadCtrl, toastCtrl);
      }
      // receipt += commands.HARDWARE.HW_INIT;
      // receipt += commands.HARDWARE.HW_RESET;
    });

  }

  private habilitandoImpresora(device: any, receipt: string, alertCtrl: AlertController, loadCtrl: LoadingController) {
    this.habilitarBluetooth().then(() => {
      this.imprimir(device, receipt, alertCtrl, loadCtrl);
    });
  }


  seleccionarImpresora(receipt: string, alertCtrl: AlertController, loadCtrl: LoadingController,
    toastCtrl: ToastController, imprimir: boolean = true) {
    let alert = alertCtrl.create({
      title: 'Impresoras disponibles',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: imprimir?'IMPRIMIR':"SELECCIONAR",
        handler: (device) => {
          if (!device) {
            // this.showToast('Impresora seleccinada!');
            return false;
          }
          //console.log(device);
          this.storage.set("IMPRESORA_PRE", device);
          if (imprimir) {
            this.imprimir(device, receipt, alertCtrl, loadCtrl);
          }
        }
      }]
    });

    this.habilitarBluetooth().then(() => {
      this.buscarBluetooth().then(devices => {
        devices.forEach((device) => {
          console.log('Dispositivos: ', JSON.stringify(device));
          alert.addInput({
            name: 'Impresora',
            value: device.address,
            label: device.name,
            type: 'radio',
            checked: true
          });
        });
        alert.present();
      }).catch((error) => {
        console.log(error);
        this.showToast('Hubo un error al conectar la impresora, intente de nuevo!', toastCtrl);
      });
    }).catch((error) => {
      console.log(error);
      this.showToast('Error al activar bluetooth, por favor intente de nuevo!', toastCtrl);
    });
  }

  imprimir(device, data, alertCtrl: AlertController, loadCtrl: LoadingController) {
    console.log('MAC del dispositivo: ', device);
    console.log('Información: ', data);

    this.estaConectado().then((exito) => {
      if (exito) {
        console.log("SI ESTÁ CONECTADO");
        this.imprimirData(data, alertCtrl, loadCtrl)
      }
      else {
        console.log("NO ESTÁ CONECTADO");

        this.conectando(device, data, alertCtrl, loadCtrl);
      }
    }).catch((error) => {
      console.error("NO ESTÁ CONECTADO ", error.message);

      this.conectando(device, data, alertCtrl, loadCtrl);
    });

  }

  private conectando(device: any, data: any, alertCtrl: AlertController, loadCtrl: LoadingController) {
    this.conectarBluetooth(device).subscribe(status => {
      console.log(status);
      this.imprimirData(data, alertCtrl, loadCtrl);
    }, error => {
      console.log(error);
      let alert = alertCtrl.create({
        title: 'Hubo un error al conectar con la impresora, intente de nuevo!',
        buttons: ['Ok']
      });
      alert.present();
    });
  }

  private imprimirData(data: any, alertCtrl: AlertController, loadCtrl: LoadingController) {
    let load = loadCtrl.create({
      content: 'Imprimiendo...'
    });
    load.present();
    this.printData(this.noSpecialChars(data))
      .then(printStatus => {
        console.log(printStatus);
        let alert = alertCtrl.create({
          title: 'Por favor, retire el recibo de su impresora.',
          buttons: ['Ok']
        });
        // this.navCtrl.push(MenuPrincipalPage);
        load.dismiss();
        alert.present();
        //this.respuestaExito = '¡El pago se realizó exitosamente!';
        //console.log(this.respuestaExito);
        // this.desconectarBluetooth();

      })
      .catch(error => {
        console.log(error);
        let alert = alertCtrl.create({
          title: 'Se produjo un error al imprimir, intente de nuevo por favor!',
          buttons: ['Ok']
        });
        load.dismiss();
        alert.present();
        //this.respuestaError = '¡El pago no se realizó!';
        this.desconectarBluetooth();
      });
  }

  showToast(data, toastCtrl: ToastController) {
    let toast = toastCtrl.create({
      duration: 3000,
      message: data,
      position: 'bottom'
    });
    toast.present();
  }
}
