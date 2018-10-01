import { Injectable } from '@angular/core';
import { GLOBAL } from './../../providers/fecha/globales';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { DatabaseProvider } from '../../providers/database/database';
/*
  Generated class for the SincGetProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SincGetProvider {

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

  constructor(private databaseprovider: DatabaseProvider,
    private storage: Storage,
    public http: HttpClient, ) {
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


  /**
   * @loadUsuarios(): Descarga usuarios del REST API
   */
  loadUsuarios() {
    //this.setOcupado('Descargando datos de usuarios...');

    let parametros = 'authorization=' + this.TOKEN;

    //usuarios
    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL + 'user/query', parametros, { headers: this.headers })
        .subscribe(res => {
          if (res["status"] != "error") {
            let datosServidor = res['users']; //"users" key del Json

            let ContadorLongitud = datosServidor.length;
            console.log("Longitud: " + ContadorLongitud);

            this.sql_usuarios = '';

            datosServidor.forEach(elemento => {
              this.sql_usuarios += "INSERT INTO tusuario (pkidusuario, identificacion,nombreusuario,apellido,usuarioactivo,fkidrol,contrasenia,rutaimagen, numerorecibo) VALUES ("
                + "" + elemento.pkidusuario + ", "
                + "'" + elemento.identificacion + "',"
                + "'" + elemento.nombreusuario + "',"
                + "'" + elemento.apellido + "',"
                + "'" + elemento.usuarioactivo + "',"
                + "'" + elemento.fkidrol + "',"
                + "'" + elemento.contrasenia + "',"
                + "'" + elemento.rutaimagen + "',"
                + "'1'" + ");"


            });
            console.log("termino de armar archivo usuarios");

            this.databaseprovider.fillDatabase(this.sql_usuarios);
            resolve(res);

          }
          else
          {
            reject("error")
          }
        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar usuarios" + e.message) });
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
          let datosServidor = res['sector']; //"sector" key del Json

          let ContadorLongitud = datosServidor.length;
          console.log("Longitud: " + ContadorLongitud);

          this.sql_tipoSectores = '';

          datosServidor.forEach(elemento => {
            this.sql_tipoSectores += "INSERT INTO tsector ( pkidsector, nombresector, fkidplaza, fkidtiposector) VALUES (" +
              "" + elemento.pkidsector + ", " +
              "'" + elemento.nombresector + "', " +
              "'" + elemento.fkidplaza + "', " +
              "'" + elemento.fkidtiposector + "'); ";
            console.log("INSERT INTO tsector ( pkidsector, nombresector, fkidplaza, fkidtiposector) VALUES (" +
              "" + elemento.pkidsector + ", " +
              "'" + elemento.nombresector + "', " +
              "'" + elemento.fkidplaza + "', " +
              "'" + elemento.fkidtiposector + "'); ");

          });

          console.log("termino de armar archivo sectores");

          this.databaseprovider.fillDatabase(this.sql_tipoSectores);
          resolve(res);

        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar sectores" + e.message) });
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
          let datosServidor = res['plaza']; //"plaza" key del Json

          let ContadorLongitud = datosServidor.length;
          console.log("Longitud: " + ContadorLongitud);

          this.sql_plazas = '';

          datosServidor.forEach(elemento => {
            this.sql_plazas += "INSERT INTO tplaza (pkidplaza, nombreplaza) VALUES ("
              + "" + elemento.pkidplaza + ","
              + "'" + elemento.nombreplaza + "');"

          });
          console.log("termino de armar archivo plazas");

          this.databaseprovider.fillDatabase(this.sql_plazas);
          resolve(res);

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

          let datosServidor = res['tercero']; //"tercero" key del Json

          let ContadorLongitud = datosServidor.length;
          console.log("Longitud: " + ContadorLongitud);

          this.sql_terceros = '';

          datosServidor.forEach(elemento => {
            this.sql_terceros += "INSERT INTO ttercero (nombretercero, identificaciontercero, telefonotercero, creaciontercero, modificaciontercero, pkidtercero, tipotercero) VALUES ("
              + "'" + elemento.nombretercero + "',"
              + "'" + elemento.identificaciontercero + "',"
              + "'" + elemento.telefonotercero + "',"
              + "'" + elemento.creaciontercero + "',"
              + "'" + elemento.modificaciontercero + "',"
              + "" + elemento.pkidtercero + ","
              + "'" + elemento.tipotercero + "');"

          });
          console.log("termino de armar archivo terceros");

          this.databaseprovider.fillDatabase(this.sql_terceros);
          resolve(res);


        }, error => {
          console.error(error.message);
        });
    }).catch(e => { console.error("Error al descargar terceros" + e.message) });
  }


}


