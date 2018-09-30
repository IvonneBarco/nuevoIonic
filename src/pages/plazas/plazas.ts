import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatabaseProvider } from './../../providers/database/database';
import { GLOBAL } from './../../providers/fecha/globales';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { MenuPrincipalPage } from '../menu-principal/menu-principal';
import { HomePage } from '../home/home';

import { Storage } from '@ionic/storage';
import { ConfiguracionesPage } from '../configuraciones/configuraciones';

/**
 * Generated class for the PlazasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-plazas',
  templateUrl: 'plazas.html',
})
export class PlazasPage {

  usuario = {};
  usuarios = [];

  plaza: string;
  sector: string;
  keyPlaza: string = "plazaData";
  keySector: string = "sectorData";

  loading: any; //Mensaje de carga

  _TOKEN: any = "tokenData"; //Recupera el token guardado en el Storage
  TOKEN: any;
  public API_URL: string;
  public headers;

  usuariosData: any[]; //descarga los datos de la REST API

  public sql_usuarios: string; //guarda la sql para insertar
  public sql_tabla_usuarios = 'CREATE TABLE IF NOT EXISTS tusuario (id INTEGER PRIMARY KEY AUTOINCREMENT, pkidusuario TEXT, nombreusuario TEXT, contrasenia TEXT, apellido TEXT, identificacion TEXT, codigousuario TEXT, rutaimagen TEXT, usuarioactivo TEXT); ';

  /* Variables para crear el archivo sql*/
  public pkidusuario: number;
  public nombreusuario: string;
  public contrasenia: string;
  public apellido: number;
  public identificacion: string;
  public codigousuario: string;
  public rutaimagen: string;
  public usuarioactivo: string;



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public apiServices: ApiServicesProvider,
    public databaseprovider: DatabaseProvider,
    public http: HttpClient
  ) {
    this.API_URL = GLOBAL.url;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    /**
     * Recupera el token que se generó al inicio de sesión
     */
    this.storage.get(this._TOKEN).then((val) => {
      this.TOKEN = val;
      //console.log('TOKEN STORAGE en plaza', val);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlazasPage');
  }

  /**
   * 
   * @param mensaje recibe el mensaje que se mostrará en el loadingController
   */
  setOcupado(mensaje: string = 'cargando') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });

    this.loading.present();

  }

  /**
   * Destruye el loading al obtener una respuesta
   */
  setDesocupado() {
    this.loading.dismiss();
  }

  /**
   * Guarda la plaza seleccionada a recaudar en el storage
   */
  seleccionarPlaza() {
    this.storage.set(this.keyPlaza, this.plaza);
    console.log("Plaza Storange: " + this.plaza);
    this.navCtrl.push(MenuPrincipalPage);

  }

  /**
   * Navega a la pagina HomePage
   */
  goToHome() {
    this.navCtrl.setRoot(HomePage);
  }


  /**
   * Descarga las tablas: usuarios, plazas, sectores y configuración
   * y posteriormente las guarda en la base de datos local
   */
  loadUsuarios() {
    this.setOcupado('Descargando datos...');

    let parametros = 'authorization=' + this.TOKEN;

    return new Promise(resolve => {
      this.http.post(this.API_URL + 'user/query', parametros, { headers: this.headers })
        .subscribe(res => {
          resolve(res);
          //console.log("AQUI: " + res.users[2].contrasenia);
          this.setDesocupado();

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar" + e.message) });
  }

  
  /**
   * Trae los datos desde el API con (loadUsuarios();), 
   * los guarda en la variable sql_usuarios 
   * y posteriormente crea el archivo RecaudoDB.sql el cual contiene la creación y los insert de la tabla tipo usuario
   */
  sincronizacionBase() {
    console.log("inicio a descargar");

    this.loadUsuarios().then(
      async (res) => {
        this.usuariosData = res['users'];

        let ContadorLongitud = this.usuariosData.length;
        console.log("Longitud: " + ContadorLongitud);

        this.sql_usuarios = '';

        this.usuariosData.forEach(elemento => {

          "INSERT INTO tusuario (pkidusuario,"
            + "identificacion,"
            + "nombreusuario,"
            + "apellido,"
            + "usuarioactivo,"
            + "fkidrol,"
            + "contrasenia,"
            + "rutaimagen)"
          "VALUES (" + elemento.pkidusuario + ", "
            + "'" + elemento.identificacion + "',"
            + "'" + elemento.nombreusuario + "',"
            + "'" + elemento.apellido + "',"
            + "'" + elemento.usuarioactivo + "',"
            + "'" + elemento.fkidrol + "',"
            + "'" + elemento.contrasenia + "',"
            + "'" + elemento.rutaimagen + ");"

        });
        console.log("termino de armar archivo");

        this.databaseprovider.fillDatabase(this.sql_tabla_usuarios + this.sql_usuarios);

        console.log("ESTE ES EL SQL: " + this.sql_usuarios)

      }, (error) => {
        console.error("Error al descargar usuarioes " + error.massage);
      })
  }

  backup() {
    this.databaseprovider.backup();
  }


  restore() {
    this.databaseprovider.restore();
  }

  loadUserData() {
    this.databaseprovider.getAllUsuarios().then(data => {

      this.usuarios = data;
    })
  }

  goToConfiguracion(){
    this.navCtrl.push(ConfiguracionesPage);
  }


}
