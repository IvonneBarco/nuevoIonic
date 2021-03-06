import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { AlertController } from 'ionic-angular';
import { PrinterProvider } from '../../providers/printer/printer';
import { commands } from '../../providers/printer/printer-commands';
import { NumbersToLettersProvider } from '../../providers/numbers-to-letters/numbers-to-letters'
import { MenuPrincipalPage } from '../menu-principal/menu-principal';
import { Storage } from '@ionic/storage';
import { ReciboPage } from '../recibo/recibo';
import { SingletonProvider } from '../../providers/singleton/singleton';


/**
 * Generated class for the RecaudoPuestosEventualesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-recaudo-puestos-eventuales',
  templateUrl: 'recaudo-puestos-eventuales.html',
})
export class RecaudoPuestosEventualesPage {

  //Datos de storange
  keyIdentificacion: string = "identiData";
  identiStorage: any = '';
  keyRecaudador: string = "nomRecaudadorData";
  recaudador: any = '';
  keyPlaza: string = "plazaData";
  miplaza: any = '';


  items: string[];
  usuario = {};
  usuarios = [];
  flagNuevo: boolean = true;
  fechaCreacion: any = new Date().toLocaleString();
  fechaModificacion: any = new Date().toLocaleString();

  terceros = [];
  tarifa: any = '3000';
  nombretercero: any;
  identificaciontercero: any;
  telefonotercero: any;
  modificaciontercero: any;
  creaciontercero: any;
  valorPagar: any = this.tarifa;

  dato: any;

  identificacion: any;
  nombrerecaudador: any;
  apellido: any;

  //Variables para cargar recibo
  reciboPage = ReciboPage;

  recibos: any;
  numRecibo: any = '001';
  totalCuota: any;
  ccUsuario: any;
  plaza: any;
  sector: any;
  puesto: any;
  totalAbono: any;
  saldo: any = '0';
  numAbonoFactura: any;
  numAbonoAcuerdo: any;
  mesPago: any;
  fechaAbono: any = new Date().toLocaleString();

  miFecha: any = '';


  //Separador de miles
  DECIMAL_SEPARATOR = ",";
  GROUP_SEPARATOR = ".";
  budget = 0;

  //Guardar recibo
  pkidrecibopuestoeventual: any;
  numerorecibopuestoeventual: any;
  valorecibopuestoeventual: any;
  creacionrecibopuestoeventual: any;
  modificacionrecibopuestoeventual: any;
  fkidtarifapuestoeventual: any;
  fkidtercero: any;
  nombretercero_: any;
  valortarifa: any;
  nombreplaza: any;
  recibopuestoeventualactivo: any;
  nombreusuario: any;
  identificacionusuario: any;
  nombresector: any;
  fkidsector: any;
  sincronizado: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    public databaseprovider: DatabaseProvider,
    public speechRecognition: SpeechRecognition,
    private printer: PrinterProvider,
    private conversion: NumbersToLettersProvider,
    private storage: Storage,
    private singleton: SingletonProvider
  ) {

    console.log("USUARIO: ", singleton.usuario["nombreusuario"]);

    //Recupera id recaudador
    this.storage.get(this.keyIdentificacion).then(
      (val) => {
        this.identiStorage = val;
        console.log('Identificacion Storage r: ', this.identiStorage);
      }
    );


    //Recupera nombre y apellido del recaudador
    this.storage.get(this.keyRecaudador).then(
      (val) => {
        this.recaudador = val;
        console.log('Nombre Storage r: ', this.recaudador);
      }
    );

    //Recupera la plaza
    this.storage.get(this.keyPlaza).then(
      (val) => {
        this.miplaza = val;
        //console.log('Plaza Storage', val);
        console.log('Plaza Storage', this.miplaza);
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RecaudoPuestosEventualesPage');
  }

  //para miles  
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


  loadUserData() {
    this.databaseprovider.getAllUsuarios().then(data => {

      this.usuarios = data;
    })
  }

  loadTercerosData() {
    this.databaseprovider.getAllTerceros().then(data => {

      this.terceros = data;
    })
  }

  loadRecibosData() {
    this.databaseprovider.getAllRecibosEventuales().then(data => {

      this.recibos = data;
    })
  }


  buscarTercero() {
    console.log("buscar: ", this.usuario['identificaciontercero']);
    this.databaseprovider.getTercero(this.usuario['identificaciontercero']).then(data => {
      //let terceros = data;
      let identificacion = this.usuario['identificaciontercero'];
      this.flagNuevo = data == null;
      if (this.flagNuevo) {
        this.usuario = { pkidsqlite: -1, nombretercero: null, identificaciontercero: identificacion, telefonotercero: null }
      }
      else {
        this.usuario = data;
      }


      console.log(this.usuario['nombretercero']);

    })
      .catch(error => {
        console.log("No existe, hay que agregarlo!");
      });

    console.log(this.usuario['nombretercero']);

  }

  audioValor() {

    // Request permissions
    this.speechRecognition.requestPermission()
      .then(
        () => console.log('Granted'),
        () => console.log('Denied')
      )
    this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => console.log(available))

    // Start the recognition process
    this.speechRecognition.startListening()
      .subscribe(
        (matches: Array<string>) => {
          let aux = '';
          matches.forEach(element => {
            aux = element;
            //console.log("AUX", aux);
          });
          this.valorPagar = aux;

        },
        (onerror) => console.log('error:', onerror)
      )

  }

  buscarIdTercero() {
    this.buscarTercero();

  }

  //Agrega registros desde el formulario


  addTercero() {
    this.creaciontercero = this.fechaCreacion;
    this.modificaciontercero = this.fechaModificacion;
    this.usuario['creaciontercero'] = this.creaciontercero;
    this.usuario['modificaciontercero'] = this.modificaciontercero;
    this.usuario['pkidtercero'] = '-1';
    this.usuario['tipotercero'] = 'Eventual';

    //this.databaseprovider.addTercero(this.usuario['nombretercero'], this.usuario['identificaciontercero'], this.usuario['telefonotercero'], this.usuario['creaciontercero'], this.usuario['modificaciontercero'], this.usuario['pkidtercero'], this.usuario['tipotercero'])
    this.databaseprovider.addTercero(this.usuario['nombretercero'], this.usuario['identificaciontercero'], this.usuario['telefonotercero'], this.usuario['creaciontercero'], this.usuario['modificaciontercero'], this.usuario['pkidtercero'], this.usuario['tipotercero'])

      .then(data => {
        this.loadTercerosData();
      });
    this.usuario = {};
  }


  //Editar registros desde el formulario
  updateTercero() {
    this.usuario['modificaciontercero'] = this.fechaModificacion;
    this.databaseprovider.updateTercero(this.usuario['nombretercero'], this.usuario['telefonotercero'], this.usuario['modificaciontercero'], this.usuario['identificaciontercero'])

      .then(data => {
        this.loadTercerosData();
      });
    this.usuario = {};
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

  imprimir() {
    this.navCtrl.push("ReciboPage", { datosRecibo: this.armarRecibo(), callback: this.imprimirFunc });
  }
  imprimirFunc = (resultado) => {
    return new Promise((resolve, reject) => {
      if (resultado) {
        this.prepararImpresion();
      }
      else {
        console.log("no imprimir");
      }

      resolve();
    });
  }

  guardar() {


    this.navCtrl.push("ReciboPage", { datosRecibo: this.armarRecibo(), callback: this.guardarFunc });
  }
  guardarFunc = (resultado) => {
    return new Promise((resolve, reject) => {
      if (resultado) {
        this.guardarRecibo();
      }
      else {
        console.log("no guardar");
      }

      resolve();
    });
  }

  private armarRecibo() {
    let datos = [];
    let numeroEnLetras = this.conversion.numeroALetras(this.unFormat(this.valorPagar), 0);
    datos.push({ "E": "No Recibo:", "V": this.numRecibo });
    datos.push({ "E": "Tarifa:", "V": this.format(this.tarifa) });
    datos.push({ "E": "Valor pagado:", "V": this.format(this.valorPagar) });
    datos.push({ "E": "En letras:", "V": numeroEnLetras });
    datos.push({ "E": "Usuario:", "V": this.usuario['nombretercero'] });
    datos.push({ "E": "Recaudador:", "V": this.recaudador });
    datos.push({ "E": "Fecha:", "V": new Date().toISOString() });
    return datos;
  }

  //Prepara el documeto a imprimir
  prepararImpresion() {


    let numeroEnLetras = this.conversion.numeroALetras(this.unFormat(this.valorPagar), 0);
    console.log("valor en letras: " + numeroEnLetras);

    let saldo = Math.abs(parseFloat(this.tarifa) - parseFloat(this.unFormat(this.valorPagar)));


    let receipt = '';
    receipt += commands.HARDWARE.HW_INIT;
    receipt += commands.HARDWARE.HW_RESET;

    //Titulo    
    receipt += commands.TEXT_FORMAT.TXT_4SQUARE;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += 'ALCALDÍA DE PASTO';
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

    //Tipo de recaudo
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += 'RECAUDO PUESTO EVENTUAL'.toUpperCase();
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;


    //No. Recibo
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_RT;
    receipt += commands.TEXT_FORMAT.TXT_2HEIGHT;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += 'Recibo No.: ' + this.numRecibo;
    receipt += commands.EOL;

    //Nombre Usuario    
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += commands.EOL;
    receipt += 'Nombre Usuario:      ' + this.usuario['nombretercero']; //21 espacios
    let nomtercero = this.usuario['nombretercero'];
    console.log("DATO 1: ", nomtercero);


    //CC Usuario
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'CC:                  ' + this.usuario['identificaciontercero'];
    let idtercero = this.usuario['identificaciontercero'];
    console.log("DATO 1: ", idtercero);



    //Tarifa
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Tarifa:              $ ' + this.format(this.tarifa);

    //Valor pagado
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_BOLD_ON;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_LT;
    receipt += 'Valor Pagado:        $ ' + this.format(this.valorPagar);

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

    if (saldo == 0) {
      console.log("sIN SALDO")
      receipt += 'Saldo:               $ 0';
    } else {
      receipt += 'Saldo:               $ ' + this.format(saldo);
      console.log("Sobre: ", this.format(saldo));

    }


    receipt += commands.EOL;

    //Espacio
    receipt += commands.EOL;
    receipt += commands.TEXT_FORMAT.TXT_NORMAL;
    receipt += commands.TEXT_FORMAT.TXT_ALIGN_CT;
    receipt += '---';


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
    console.log("AQUI Rec: ", this.recaudador);


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


    this.printer.iniciarImpresion(receipt, this.alertCtrl, this.loadCtrl, this.toastCtrl);

    this.guardarRecibo();

  }


  m() {

    this.loadRecibosData();
    this.loadTercerosData();

    console.log("VALOR PAGAR: ", this.format(this.valorPagar));
    console.log("TARIFA: ", this.format(this.tarifa));

    let misaldo: any;
    misaldo = parseFloat(this.tarifa) - parseFloat(this.unFormat(this.valorPagar));
    console.log("SALDO: ", Math.abs(misaldo));

    console.log("NOMBRE: ", this.usuario['nombretercero']);
    console.log('Identificacion Storage r: ', this.identiStorage);
    console.log('Nombre recaudador Storage: ', this.recaudador);
  }

  //Guarda en la tabla treciboeventual
  guardarRecibo() {

    console.log("flag ", this.flagNuevo);
    if (this.flagNuevo) {
      this.addTercero();
    }
    else {
      this.updateTercero();

    }
    //Recibo guardado en la bd
    this.pkidrecibopuestoeventual = '1';
    this.numerorecibopuestoeventual = '1';
    this.valorecibopuestoeventual = this.valorPagar;
    this.creacionrecibopuestoeventual = this.fechaCreacion;
    this.modificacionrecibopuestoeventual = this.fechaModificacion;
    this.fkidtarifapuestoeventual = '1';
    this.fkidtercero = 1;
    this.nombretercero_ = this.usuario["nombretercero"];
    this.valortarifa = this.tarifa;
    this.nombreplaza = this.miplaza;
    this.recibopuestoeventualactivo = '1';
    this.nombreusuario = this.recaudador;
    this.identificacionusuario = this.identiStorage;
    this.nombresector = 'Sector 1';
    this.fkidsector = '1';
    this.sincronizado = '0';

    this.usuario['pkidrecibopuestoeventual'] = this.pkidrecibopuestoeventual;
    this.usuario['numerorecibopuestoeventual'] = this.numerorecibopuestoeventual;
    this.usuario['valorecibopuestoeventual'] = this.valorecibopuestoeventual;
    this.usuario['creacionrecibopuestoeventual'] = this.creacionrecibopuestoeventual;

    this.usuario['modificacionrecibopuestoeventual'] = this.modificacionrecibopuestoeventual;
    this.usuario['fkidtarifapuestoeventual'] = this.fkidtarifapuestoeventual;
    this.usuario['fkidtercero'] = this.fkidtercero;
    this.usuario['nombretercero'] = this.nombretercero_;

    this.usuario['valortarifa'] = this.valortarifa;
    this.usuario['nombreplaza'] = this.nombreplaza;
    this.usuario['recibopuestoeventualactivo'] = this.recibopuestoeventualactivo;
    this.usuario['nombreusuario'] = this.nombreusuario;

    this.usuario['identificacionusuario'] = this.identificacionusuario;
    this.usuario['nombresector'] = this.nombresector;
    this.usuario['fkidsector'] = this.fkidsector;
    this.usuario['sincronizado'] = this.sincronizado;

    this.databaseprovider.addReciboEventual(this.usuario['pkidrecibopuestoeventual'], this.usuario['numerorecibopuestoeventual'], this.usuario['valorecibopuestoeventual'], this.usuario['creacionrecibopuestoeventual'], this.usuario['modificacionrecibopuestoeventual'], this.usuario['fkidtarifapuestoeventual'], this.usuario['fkidtercero'], this.usuario['nombretercero'], this.usuario['valortarifa'], this.usuario['nombreplaza'], this.usuario['recibopuestoeventualactivo'], this.usuario['nombreusuario'], this.usuario['identificacionusuario'], this.usuario['nombresector'], this.usuario['fkidsector'], this.usuario['sincronizado'])

      .then(data => {
        this.loadRecibosData();
      });
    // this.usuario = {};
  }


  //Guarda los datos de la bd en el servidor
  synRecibo() {
    let newRecibo = [{

      pkidrecibopuestoeventual: this.pkidrecibopuestoeventual,
      numerorecibopuestoeventual: this.numerorecibopuestoeventual,
      valorecibopuestoeventual: this.valorecibopuestoeventual,
      creacionrecibopuestoeventual: this.creacionrecibopuestoeventual,
      modificacionrecibopuestoeventual: this.modificacionrecibopuestoeventual,
      fkidtarifapuestoeventual: this.fkidtarifapuestoeventual,
      fkidtercero: this.fkidtercero,
      nombretercero_: this.nombretercero_,
      valortarifa: this.valortarifa,
      nombreplaza: this.nombreplaza,
      recibopuestoeventualactivo: this.recibopuestoeventualactivo,
      nombreusuario: this.nombreusuario,
      identificacionusuario: this.identificacionusuario,
      nombresector: this.nombresector,
      fkidsector: this.fkidsector,
      sincronizado: '1'
    }]

    this.dato.addConfiguracion(newRecibo)
      .then(res => {
        console.log('Respuesta: ', res);
      })
      .catch(error => {
        console.error('Error al guardar: ', error);
      })
  }


}