import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController, NavParams } from 'ionic-angular';
import { PrinterProvider } from '../../providers/printer/printer';
import { commands } from '../../providers/printer/printer-commands';
import { NumbersToLettersProvider } from '../../providers/numbers-to-letters/numbers-to-letters'
import { SeparadorMilesProvider } from './../../providers/separador-miles/separador-miles';
import { FechaProvider } from '../../providers/fecha/fecha';
import { MenuPrincipalPage } from '../menu-principal/menu-principal';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the RecaudoPuestosFijosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-recaudo-puestos-fijos',
  templateUrl: 'recaudo-puestos-fijos.html',
})
export class RecaudoPuestosFijosPage {

  inputData: any = {};
  miFecha: any = '';

  //Parametros Recibidos
  idRecibido: any; //Carga la información del usuario recibido
  //plazaRecibida: string;
  keyPlaza: string = "plazaData";
  miplaza: any = '';
  zonaRecibida: string;
  sectorRecibido: string;

  //Variables para cargar recibo
  numRecibo: any;
  totalCuota: any;
  nombreUsuario: any;
  ccUsuario: any;
  plaza: any;
  sector: any;
  puesto: any;

  totalAbono: any;
  saldo: any;
  numAbonoFactura: any;
  numAbonoAcuerdo: any;
  mesPago: any;
  fechaAbono: any = new Date().toLocaleString();
  //fechaAbono: any = new Date().toISOString();
  recaudador: any;

  respuestaExito: any;
  respuestaError: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private printer: PrinterProvider,
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private conversion: NumbersToLettersProvider,
    private separadorMiles: SeparadorMilesProvider,
    private fechaProvider: FechaProvider,
    private storage: Storage
  ) {

    this.idRecibido = navParams.get('id');
    this.zonaRecibida = navParams.get('zona');
    this.sectorRecibido = navParams.get('sector');

    this.storage.get(this.keyPlaza).then(
      (val) => {
        this.miplaza = val;
        //console.log('Plaza Storage', val);
        console.log('Plaza Storage', this.miplaza);
      }
    );


    console.log("Id Recibido: " + this.idRecibido + " Zona: " + this.zonaRecibida + " Sector: " + this.sectorRecibido);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecaudoPuestosFijosPage');
    this.cargarDatos();

  }

  //Alert para mostrar información necesaria
  showToast(data) {
    let toast = this.toastCtrl.create({
      duration: 3000,
      message: data,
      position: 'bottom'
    });
    toast.present();
  }

  //Metodo para escribir caracteres 
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

  //Ejecuta la impresión que se envia desde prepareToPrint
  print(device, data) {
    console.log('MAC del dispositivo: ', device);
    console.log('Información: ', data);
    let load = this.loadCtrl.create({
      content: 'Imprimiendo...'
    });
    load.present();
    this.printer.conectarBluetooth(device).subscribe(status => {
      console.log(status);
      this.printer.printData(this.noSpecialChars(data))
        .then(printStatus => {
          console.log(printStatus);
          let alert = this.alertCtrl.create({
            title: 'Por favor, retire el recibo de su impresora.',
            buttons: ['Ok']
          });
          this.navCtrl.push(MenuPrincipalPage);
          load.dismiss();
          alert.present();
          this.respuestaExito = '¡El pago se realizó exitosamente!';
          console.log(this.respuestaExito);
          this.printer.desconectarBluetooth();
        })
        .catch(error => {
          console.log(error);
          let alert = this.alertCtrl.create({
            title: 'Se produjo un error al imprimir, intente de nuevo por favor!',
            buttons: ['Ok']
          });
          load.dismiss();
          alert.present();
          this.respuestaError = '¡El pago no se realizó!';
          this.printer.desconectarBluetooth();
        });
    },
      error => {
        console.log(error);
        let alert = this.alertCtrl.create({
          title: 'Hubo un error al conectar con la impresora, intente de nuevo!',
          buttons: ['Ok']
        });
        load.dismiss();
        alert.present();
        this.respuestaError = '¡El pago no se realizó!';
      });
  }

  //Prepara el documeto a imprimir
  prepareToPrint(data) {
    data.valorAcuerdoPago = '';

    try {
      let aux: number = this.inputData['data.valorAbonoCuota'];
      //se convierte la cadena en numero
      let auxNum = parseFloat(this.unFormat(aux));
      //let auxNum = parseFloat(this.conversion.unFormat(aux));
      auxNum += 10;
      console.log(auxNum);
    } catch (error) {

    }

    

    this.totalAbono = data.valorAbonoCuota + data.valorAcuerdoPago;
    console.log("Total Abono: " + this.totalAbono);

    this.saldo = this.totalCuota - this.totalAbono;

    console.log("SALDO FINAL: " + this.totalCuota + " - " + this.totalAbono + "=" + ' $' + this.saldo);


    let numeroEnLetras = this.conversion.numeroALetras(data.valorAbonoCuota, 0);
    console.log("valor en letras: " + numeroEnLetras);

    let receipt = '';
    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.HARDWARE.HW_RESET;

    //Titulo    
    receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'ALCALDÍA DE PASTO'.toUpperCase();
    receipt += commands.EOL;

    //Lema
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += 'Legitimidad, Paticipación y Honestidad';
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;

    //Subtitulo
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += 'DIRECCIÓN ADMINISTRATIVA DE PLAZAS DE MERCADO'.toUpperCase();
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;

    //Mercado
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'PLAZA: ' + this.miplaza.toUpperCase();

    //Sector
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'SECTOR: ' + this.sectorRecibido.toUpperCase();

    //No. Recibo
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
    receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += 'Recibo No.: ' + this.numRecibo + ''.toUpperCase();
    receipt += commands.EOL;

    //Nombre Usuario    
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += commands.EOL;
    receipt += 'Nombre Usuario:      ' + this.nombreUsuario; //21 espacios

    //CC Usuario
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'CC:                  ' + this.ccUsuario;

    //Tarifa
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Tarifa del mes:      $' + this.totalCuota;

    //Tarifa
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Abono acuerdo:       $NaN';

    //Abono cuota mes
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Abono cuota mes:     $' + data.valorAbonoCuota;

    //Abono acuerdo de Pago
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Total abono          $' + this.totalAbono;

    //Valor en letras
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += '(' + numeroEnLetras + ')';

    // Saldo
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Saldo:               $' + this.saldo;
    receipt += commands.EOL;

    //Espacio
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += '---';


    //Puesto
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Puesto:              ' + this.puesto;

    //Abono Factura No.
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Abono a Factura No.: ' + this.numAbonoFactura;

    //Mes
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Por el mes de:       ' + this.mesPago;

    //Fecha de Abono
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Fecha de Abono:      ' + this.fechaAbono;
    console.log("fechaAbono: " + this.fechaAbono);

    //Recaudador
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'RECAUDADOR:          ' + this.recaudador;

    //Espacio para el pie de pagina
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += '---';

    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ITALIC_ON
    receipt += 'Saque copia y guarde este recibo como soporte de pago';
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += '      ';
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += commands.EOL;
    receipt += commands.EOL;

    let alert = this.alertCtrl.create({
      title: 'Impresoras disponibles',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'IMPRIMIR',
        handler: (device) => {
          if (!device) {
            this.showToast('Impresora seleccinada!');
            return false;
          }
          console.log(device);
          this.print(device, receipt);
        }
      }
      ]
    });

    this.printer.habilitarBluetooth().then(() => {
      this.printer.buscarBluetooth().then(devices => {
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
        this.showToast('Hubo un error al conectar la impresora, intente de nuevo!');
      });
    }).catch((error) => {
      console.log(error);
      this.showToast('Error al activar bluetooth, por favor intente de nuevo!');
      this.respuestaError = '¡El pago no se realizó!';
    });

    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.HARDWARE.HW_RESET;

  }


  //imprimirRecibo genera el recibo para imprimir
  imprimirRecibo(data) {
    this.fechaProvider.traerFechaActual().then(
      (res) => {
        this.miFecha = res;
        console.log("Fecha: " + this.miFecha.fecha);
        this.prepareToPrint(data);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  cargarDatos() {

    if (this.idRecibido == '1') {
      this.numRecibo = '00' + this.idRecibido;
      this.totalCuota = '10000';
      this.nombreUsuario = 'María del Carmen Rojas';
      this.ccUsuario = '1000000001';
      this.plaza = this.miplaza;
      this.sector = this.sectorRecibido;
      this.puesto = 'Puesto 1';
      this.totalAbono = '0';
      this.numAbonoFactura = 'Fc 001';
      this.numAbonoAcuerdo = 'Ac 001';
      this.mesPago = 'Agosto';
      this.fechaAbono = this.fechaAbono;
      this.recaudador = 'Silvio Arteaga';

    } else if (this.idRecibido == '2') {
      this.numRecibo = '00' + this.idRecibido;
      this.totalCuota = '20000';
      this.nombreUsuario = 'José María Lopez';
      this.ccUsuario = '2000000002';
      this.plaza = this.miplaza;
      this.sector = this.sectorRecibido;
      this.puesto = 'Puesto 2';
      this.totalAbono = '0';
      this.numAbonoFactura = 'Fc 002';
      this.numAbonoAcuerdo = 'Ac 002';
      this.mesPago = 'Agosto';
      this.fechaAbono = this.fechaAbono;
      this.recaudador = 'Marío Andrés Paz';

    } else if (this.idRecibido == '3') {
      this.numRecibo = '00' + this.idRecibido;
      this.totalCuota = '30000';
      this.nombreUsuario = 'Luis Fernando Ordoñez';
      this.ccUsuario = '3000000003';
      this.plaza = this.miplaza;
      this.sector = this.sectorRecibido;
      this.puesto = 'Puesto 3';
      this.totalAbono = '0';
      this.numAbonoFactura = 'Fc 003';
      this.numAbonoAcuerdo = 'Ac 003';
      this.mesPago = 'Agosto';
      this.fechaAbono = this.fechaAbono;
      this.recaudador = 'Francisco Peréz';
    }
  }

  //MostrarFecha trae la fecha del servidor
  /*mostrarFecha(data) {
    this.fechaProvider.traerFechaActual().then(
      (res) => {
        this.miFecha = res;
        console.log("Fecha: " + this.miFecha.fecha);
      },
      (error) => {
        console.error(error);
      }
    )
  }*/

  //para miles
  DECIMAL_SEPARATOR = ".";
  GROUP_SEPARATOR = ",";
  budget = 0;
  format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR)

  };

  unFormat(val) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '').replace(/\D/g, '');
    if (this.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  };


}
