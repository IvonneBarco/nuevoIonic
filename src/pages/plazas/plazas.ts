import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DatabaseProvider } from './../../providers/database/database';
import { GLOBAL } from './../../providers/fecha/globales';
import { ApiServicesProvider } from '../../providers/api-services/api-services';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { MenuPrincipalPage } from '../menu-principal/menu-principal';
import { HomePage } from '../home/home';

import { Storage } from '@ionic/storage';
import { ConfiguracionesPage } from '../configuraciones/configuraciones';
import { SingletonProvider } from '../../providers/singleton/singleton';

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
  plazas = [];

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
    public http: HttpClient, private platform: Platform,
    private singleton: SingletonProvider
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
    this.platform.ready().then(() => this.getPlazas());
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


  goToConfiguracion() {
    this.navCtrl.push(ConfiguracionesPage);
  }

  getPlazas() {
    this.databaseprovider.getAllPlazas().then(data => {

      if (data) {
        this.plazas = data;
        this.plaza = this.plazas[0]["nombreplaza"];
        this.singleton.plazas = this.plazas;
        console.log("plazas en plazas: ", this.plazas.length);
      }
      else {
        this.plazas = [{"nombreplaza":"Debe cargar plazas","pkidsqlite":-1}];
      }
    })
  }

}
