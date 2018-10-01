import { Component } from '@angular/core';
import { GLOBAL } from './../../providers/fecha/globales';
import { IonicPage, NavController, NavParams, LoadingController, Events, Platform } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatabaseProvider } from '../../providers/database/database';
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
    private databaseprovider: DatabaseProvider,
    private storage: Storage,
    private platform: Platform,
    public http: HttpClient,
    public events: Events,
    public loadingCtrl: LoadingController,
    private sincget:SincGetProvider
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
      this.loading.dismiss().catch(()=>console.error("dimis"));
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

    // this.loadSectores().then(
    //   async (res) => {
    //     let datosServidor = res['sector']; //"sector" key del Json

    //     let ContadorLongitud = datosServidor.length;
    //     console.log("Longitud: " + ContadorLongitud);

    //     this.sql_tipoSectores = '';

    //     datosServidor.forEach(elemento => {
    //       this.sql_tipoSectores += "INSERT INTO tsector ( pkidsector, nombresector, fkidplaza, fkidtiposector) VALUES (" +
    //         "" + elemento.pkidsector + ", " +
    //         "'" + elemento.nombresector + "', " +
    //         "'" + elemento.fkidplaza + "', " +
    //         "'" + elemento.fkidtiposector + "'); ";
    //         console.log("INSERT INTO tsector ( pkidsector, nombresector, fkidplaza, fkidtiposector) VALUES (" +
    //         "" + elemento.pkidsector + ", " +
    //         "'" + elemento.nombresector + "', " +
    //         "'" + elemento.fkidplaza + "', " +
    //         "'" + elemento.fkidtiposector + "'); ");
            
    //     });
        
    //     console.log("termino de armar archivo sectores");

    //     this.databaseprovider.fillDatabase(this.sql_tipoSectores);

    //   }, (error) => {
    //     console.error("Error al descargar sectores " + error.massage);
    //   });
    this.sincget.loadSectores().then(()=>{
      console.log("bien sectores");
  }).catch((err)=>console.error(err.message));

  }

  getUsuarios() {
    //Usuarios
    console.log("inició a descargar Usuarios");
    // this.loadUsuarios().then(
    //   async (res) => {
    //     let datosServidor = res['users']; //"users" key del Json

    //     let ContadorLongitud = datosServidor.length;
    //     console.log("Longitud: " + ContadorLongitud);

    //     this.sql_usuarios = '';

    //     datosServidor.forEach(elemento => {
    //       this.sql_usuarios += "INSERT INTO tusuario (pkidusuario, identificacion,nombreusuario,apellido,usuarioactivo,fkidrol,contrasenia,rutaimagen, numerorecibo) VALUES ("
    //         + "" + elemento.pkidusuario + ", "
    //         + "'" + elemento.identificacion + "',"
    //         + "'" + elemento.nombreusuario + "',"
    //         + "'" + elemento.apellido + "',"
    //         + "'" + elemento.usuarioactivo + "',"
    //         + "'" + elemento.fkidrol + "',"
    //         + "'" + elemento.contrasenia + "',"
    //         + "'" + elemento.rutaimagen + "',"
    //         + "'1'" + ");"


    //     });
    //     console.log("termino de armar archivo usuarios");

    //     this.databaseprovider.fillDatabase(this.sql_usuarios);

    //   }, (error) => {
    //     console.error("Error al descargar sectores " + error.massage);
    //   });
    
    // )
    this.sincget.loadUsuarios().then(()=>{
      console.log("bien usuarios");
  }).catch((err)=>console.error(err.message));

  }

  getPlazas() {
    console.log("inició a descargar plazas");
    // this.loadPlazas().then(
    //   async (res) => {
    //     let datosServidor = res['plaza']; //"plaza" key del Json

    //     let ContadorLongitud = datosServidor.length;
    //     console.log("Longitud: " + ContadorLongitud);

    //     this.sql_plazas = '';

    //     datosServidor.forEach(elemento => {
    //       this.sql_plazas += "INSERT INTO tplaza (pkidplaza, nombreplaza) VALUES ("
    //         + "" + elemento.pkidplaza + ","
    //         + "'" + elemento.nombreplaza + "');"

    //     });
    //     console.log("termino de armar archivo plazas");

    //     this.databaseprovider.fillDatabase(this.sql_plazas);

    //   }, (error) => {
    //     console.error("Error al descargar sectores " + error.massage);
    //   });

    this.sincget.loadPlazas().then(()=>{
      console.log("bien plazaloadPlazas");
  }).catch((err)=>console.error(err.message));
  }

  getTerceros() {
    // console.log("inició a descargar terceros");
    // this.loadTerceros().then(
    //   async (res) => {
    //     let datosServidor = res['tercero']; //"tercero" key del Json

    //     let ContadorLongitud = datosServidor.length;
    //     console.log("Longitud: " + ContadorLongitud);

    //     this.sql_terceros = '';

    //     datosServidor.forEach(elemento => {
    //       this.sql_terceros += "INSERT INTO ttercero (nombretercero, identificaciontercero, telefonotercero, creaciontercero, modificaciontercero, pkidtercero, tipotercero) VALUES ("
    //         + "'" + elemento.nombretercero + "',"
    //         + "'" + elemento.identificaciontercero + "',"
    //         + "'" + elemento.telefonotercero + "',"
    //         + "'" + elemento.creaciontercero + "',"
    //         + "'" + elemento.modificaciontercero + "',"
    //         + "" + elemento.pkidtercero + ","
    //         + "'" + elemento.tipotercero + "');"

    //     });
    //     console.log("termino de armar archivo terceros");

    //     this.databaseprovider.fillDatabase(this.sql_terceros);

    //   }, (error) => {
    //     console.error("Error al descargar terceros " + error.massage);
    //   });

    this.sincget.loadTerceros().then(()=>{
      console.log("bien terloadTerceros");
  }).catch((err)=>console.error(err.message));
  }

  backup() {
    this.databaseprovider.backup();
  }


  restore() {
    this.databaseprovider.restore();
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
