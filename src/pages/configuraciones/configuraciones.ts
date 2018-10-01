import { Component } from '@angular/core';
import { GLOBAL } from './../../providers/fecha/globales';
import { IonicPage, NavController, NavParams, LoadingController, Events, Platform, AlertController, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatabaseProvider } from '../../providers/database/database';
import { PrinterProvider } from '../../providers/printer/printer';
import { SincGetProvider } from '../../providers/sinc-get/sinc-get';

import { Storage } from '@ionic/storage';

/**
 * Generated class for the ConfiguracionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-configuraciones',
  templateUrl: 'configuraciones.html',
})
export class ConfiguracionesPage {

  sectores = [];
  usuarios = [];
  plazas = [];
  terceros = [];

  /* Variables para crear el archivo sql*/
  public pkidtiposector: number;
  public codigotiposector: string;
  public nombretiposector: string;
  public tiposectoractivo: number;
  public creaciontiposector: string;
  public modificaciontiposector: string;
  public descripciontiposector: string;

  //datosServidor: any[]; //descarga los datos de la REST API

  loading: any;

  /**
   * Variables de conexión
   */
  _TOKEN: any = "tokenData"; //Recupera el token guardado en el Storage
  TOKEN: any = '';
  public API_URL: string;
  public headers;
  public flagTercero: string = 'true';



  public sql_tipoSectores: string;
  public sql_usuarios: string;
  public sql_plazas: string;
  public sql_terceros: string;
  /* - Fin -*/

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private toastCtrl: ToastController,
    private databaseprovider: DatabaseProvider,
    private storage: Storage,
    private platform: Platform,
    public http: HttpClient,
    public events: Events,
    public loadingCtrl: LoadingController,
    private sincget: SincGetProvider,
    private impresora: PrinterProvider
  ) {

    this.API_URL = GLOBAL.url;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    /**
     * Recupera el token que se generó al inicio de sesión
     */
    this.storage.get(this._TOKEN).then((val) => {
      this.TOKEN = val;
      //console.log('TOKEN STORAGE en configuracion', val);
    });


  }

  dataSQLLocal() {
    this.databaseprovider.fillDatabase();
  }

  //Carga los registros existentes
  listarDatosDB() {

    //Sectores
    this.databaseprovider.getAllSectores().then(data => {
      this.sectores = data;
    })

    //Usuarios
    this.databaseprovider.getAllUsuarios().then(data => {
      this.usuarios = data;
    })

    //Plazas
    this.databaseprovider.getAllPlazas().then(data => {
      this.plazas = data;
    })

    //Terceros
    this.databaseprovider.getAllTerceros().then(data => {
      this.terceros = data;
    })


  }


  /* Creación de Archivo SQL*/

  setOcupado(mensaje: string = 'cargando') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });

    this.loading.present();

  }

  setDesocupado() {
    try {
      this.loading.dismiss().catch(() => console.error("dimis"));
    } catch (error) {

    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TipoSectorPage');
  }

  /**
   * @loadSectores(): Descarga sectores del REST API
   */
  loadSectores() {
    //this.setOcupado('Descargando datos sectores...');

    let parametros = 'authorization=' + this.TOKEN;

    return new Promise(resolve => {
      this.http.post(this.API_URL + 'sector/query', parametros, { headers: this.headers })
        .subscribe(res => {
          resolve(res);
          this.setDesocupado();

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar sectores" + e.message) });
  }


  /**
   * @loadUsuarios(): Descarga usuarios del REST API
   */
  loadUsuarios() {
    //this.setOcupado('Descargando datos de usuarios...');

    let parametros = 'authorization=' + this.TOKEN;

    //usuarios
    return new Promise(resolve => {
      this.http.post(this.API_URL + 'user/query', parametros, { headers: this.headers })
        .subscribe(res => {
          resolve(res);
          this.setDesocupado();

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar usuarios" + e.message) });
  }

  /**
  * @loadPlazas(): Descarga plazas del REST API
  */
  loadPlazas() {
    //this.setOcupado('Descargando datos de plazas...');

    let parametros = 'authorization=' + this.TOKEN;

    //usuarios
    return new Promise(resolve => {
      this.http.post(this.API_URL + 'plaza/query', parametros, { headers: this.headers })
        .subscribe(res => {
          resolve(res);
          this.setDesocupado();

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar plazas" + e.message) });
  }

  /**
   * @loadTerceros(): Descarga terceros del REST API
   */
  loadTerceros() {
    //this.setOcupado('Descargando datos terceros...');

    let parametros = 'authorization=' + this.TOKEN + '&tercero=' + this.flagTercero;

    return new Promise(resolve => {
      this.http.post(this.API_URL + 'asignaciondependiente/query', parametros, { headers: this.headers })
        .subscribe(res => {
          resolve(res);
          //console.log("RESPUESTA: ", res.status);

          this.setDesocupado();

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar terceros" + e.message) });
  }


  getDataApi() {
    this.setOcupado('Importando BD');
    this.getSectores();
    this.getUsuarios();
    this.getPlazas();
    this.getTerceros();
    this.setDesocupado();
  }

  /**
   * Trae los datos desde el API con (loadSectores();), 
   * los guarda en la variable sql_tipoSector 
   * y posteriormente crea el archivo RecaudoDB.sql el cual contiene la creación y los insert de la tabla tipo sector
   */
  getSectores() {
    console.log("inicio a descargar");

    this.sincget.loadSectores().then(() => {
      console.log("bien sectores");
    }).catch((err) => console.error(err.message));

  }

  getUsuarios() {
    //Usuarios
    console.log("inició a descargar Usuarios");
    this.sincget.loadUsuarios().then(() => {
      console.log("bien usuarios");
    }).catch((err) => console.error(err.message));

  }

  getPlazas() {
    console.log("inició a descargar plazas");

    this.sincget.loadPlazas().then(() => {
      console.log("bien plazaloadPlazas");
    }).catch((err) => console.error(err.message));
  }

  getTerceros() {

    this.sincget.loadTerceros().then(() => {
      console.log("bien terloadTerceros");
    }).catch((err) => console.error(err.message));
  }

  backup() {
    this.databaseprovider.backup();
  }


  restore() {
    this.databaseprovider.restore();
  }

  configurarImpresora(){
    this.impresora.seleccionarImpresora(null, this.alertCtrl, this.loadCtrl, this.toastCtrl, false);
  }

  n() {
    console.log("VER TOKEN: ", this.TOKEN);

  }

  // authorization
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/plaza/query
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/user/query
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/login
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/sector/query
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/configuracion/query
  // http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/user/query
  //http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/asignaciondependiente/query  --tercero: true
  //http://contalentosas.com/SistemaRecaudoBackend/web/app_dev.php/tarifapuestoeventual/query


}
