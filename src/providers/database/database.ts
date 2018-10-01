import { GLOBAL } from './../fecha/globales';
import { Injectable } from '@angular/core';
import { Platform, LoadingController, Events } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  database: SQLiteObject;
  public databaseReady: BehaviorSubject<boolean>;
  public crearEstructuraReady: BehaviorSubject<boolean>;
  loading: any;

  fechaCreacion: any = new Date().toLocaleString();
  fechaModificacion: any = new Date().toLocaleString();

  private bdActual: string = "bd1.db"

  constructor(
    public sqlitePorter: SQLitePorter,
    private storage: Storage,
    private sqlite: SQLite,
    private platform: Platform,
    private http: Http,
    public events: Events,
    public loadingCtrl: LoadingController
  ) {
    this.databaseReady = new BehaviorSubject(false);
    this.crearEstructuraReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.storage.get('BDACTIVA').then(val => {
        if (val) {
          this.bdActual = val;
        }
        console.log("val" + val);

        this.crearBD();
      }).catch(() => {
        console.error("error val");

      });
    });
  }

  setOcupado(mensaje: string = 'cargando') {
    this.loading = this.loadingCtrl.create({
      content: mensaje
    });

    this.loading.present();

  }

  setDesocupado() {
    this.loading.dismiss();
  }

  /**
   * Crea la Base de datos y verifica que bd se encuentra activa
   */
  private crearBD() {
    
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: this.bdActual,
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = null;
          this.database = db;
          this.storage.set('BDACTIVA', this.bdActual);
          this.databaseReady.next(true);

          // if(crearEstructura)
          // {
          // this.crearEstructura();
          // }
        }, (error => {
          console.log("Error (1) " + error.message);
        }));
    });
  }

  //Llena la base de datos
  fillDatabase(sql: string = null) {
    //this.setOcupado('Importando BD');
    if (sql != null) {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(data => {
          this.databaseReady.next(true);
          this.storage.set('database_filled', true);
          console.log("terminó de importar");
          //this.setDesocupado();
        })
        .catch(e => { console.error("Error en la Importación " + e.message) });
    }
  }

  //Check al estado de la bd
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  backup() {
    this.platform.ready().then(() => {
      this.database.abortallPendingTransactions();
      this.database.close().then(() => {
        console.info("bdActual: ", this.bdActual);

        this.bdActual = this.bdActual == "bd1.db" ? "bd2.db" : "bd1.db";
        console.info("bdActual despues: ", this.bdActual);
        this.sqlite.deleteDatabase({
          name: this.bdActual,
          location: 'default'
        }).then(() => {
          console.log("borrada");

          this.crearBD();
        }).catch((e) => {
          console.log("se creara el backup");
          this.crearBD();

        });

      });
    });
  }


  restore() {
    this.platform.ready().then(() => {
      this.database.abortallPendingTransactions();
      this.database.close().then(() => {
        console.info("bdActual: ", this.bdActual);

        this.bdActual = this.bdActual == "bd1.db" ? "bd2.db" : "bd1.db";
        console.info("bdActual despues: ", this.bdActual);
        this.crearBD();

      });
    });
  }

  crearEstructura() {
    this.http.get('assets/database/RecaudoDB.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.crearEstructuraReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }



  /**
   * USUARIOS
   */

  /**
 * Select a la tabla usuario
 */
  getAllUsuarios() {
    return this.database.executeSql("SELECT * FROM tusuario", []).then((data) => {

      let usuarios = [];
      if (data.rows.length > 0) {
        //this.setOcupado('Listando Datos Importados');
        for (var i = 0; i < data.rows.length; i++) {
          usuarios.push({ pkidusuario: data.rows.item(i).pkidusuario, nombreusuario: data.rows.item(i).nombreusuario, contrasenia: data.rows.item(i).contrasenia, apellido: data.rows.item(i).apellido, identificacion: data.rows.item(i).identificacion, codigousuario: data.rows.item(i).codigousuario, rutaimagen: data.rows.item(i).rutaimagen, usuarioactivo: data.rows.item(i).usuarioactivo });
        }
        console.log("N° Registros usuarios: " + data.rows.length);
      }
      //this.setDesocupado();
      return usuarios;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

  getUsuarioId(datoBuscar) {
    return this.database.executeSql("SELECT pkidusuario, identificacion, nombreusuario, apellido, contrasenia FROM tusuario WHERE identificacion='" + datoBuscar + "'", []).then((data) => {

      let usuario;
      if (data.rows.length > 0) {
        usuario = { pkidusuario: data.rows.item(0).pkidusuario, nombreusuario: data.rows.item(0).nombreusuario, contrasenia: data.rows.item(0).contrasenia, apellido: data.rows.item(0).apellido, identificacion: data.rows.item(0).identificacion, codigousuario: data.rows.item(0).codigousuario, rutaimagen: data.rows.item(0).rutaimagen, usuarioactivo: data.rows.item(0).usuarioactivo };
      }
      return usuario;
    }, err => {
      console.error('Error: ', err.message);
      return {};
    });
  }

  actualizarNumeroRecibo(idUsuario, nuevoValor) {
    return this.database.executeSql("UPDATE tusuario SET numerorecibo=" + nuevoValor + " WHERE pkidsqlite='" + idUsuario + "'", []).then((data) => {

      return true;
    }, err => {
      console.error('Error: ', err.message);
      return false;
    });
  }

  numeroregistrosUsuarios() {
    //select pkidusuario from tusuario limit 1


    return this.database.executeSql("SELECT pkidusuario FROM tusuario limit 1", []).then((data) => {

      let numreg = [];
      if (data.rows.length > 0) {
        numreg = data.rows.length;

      } else {
        numreg = data.rows.length;
      }
      console.log("registros: ", numreg);
      return numreg;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });


  }


  /**
   * TERCEROS
   */

  /**
  * Select a la tabla tercero
  */
  getAllTerceros() {
    return this.database.executeSql("SELECT * FROM ttercero", []).then((data) => {

      let terceros = [];
      if (data.rows.length > 0) {
        // this.setOcupado('Listando Datos Importados');
        for (var i = 0; i < data.rows.length; i++) {
          terceros.push({ pkidsqlite: data.rows.item(i).pkidsqlite, nombretercero: data.rows.item(i).nombretercero, identificaciontercero: data.rows.item(i).identificaciontercero, telefonotercero: data.rows.item(i).telefonotercero, creaciontercero: data.rows.item(i).creaciontercero, modificaciontercero: data.rows.item(i).modificaciontercero, pkidtercero: data.rows.item(i).pkidtercero, tipotercero: data.rows.item(i).tipotercero });
          //console.log("DATOS TERCERO: ", data.rows.item(i).nombretercero);
        }
        console.log("N° Registros terceros: " + data.rows.length);

      } else {
        console.log("No existe, hay que agregarlo!");
      }

      //this.setDesocupado();
      return terceros;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

  getTercero(datoBuscar) {
    return this.database.executeSql("SELECT pkidsqlite, nombretercero, identificaciontercero, telefonotercero FROM ttercero WHERE identificaciontercero='" + datoBuscar + "'", []).then((data) => {

      let terceros: any;
      if (data.rows.length > 0) {
        // this.setOcupado('Listando Datos Importados');
        // for (var i = 0; i < data.rows.length; i++) {
        //   terceros.push({ pkidsqlite: data.rows.item(i).pkidsqlite, nombretercero: data.rows.item(i).nombretercero, identificaciontercero: data.rows.item(i).identificaciontercero, telefonotercero: data.rows.item(i).telefonotercero });
        //   console.log("DATOS TERCERO: ", data.rows.item(i).nombretercero);
        // }
        terceros = { pkidsqlite: data.rows.item(0).pkidsqlite, nombretercero: data.rows.item(0).nombretercero, identificaciontercero: data.rows.item(0).identificaciontercero, telefonotercero: data.rows.item(0).telefonotercero };
        console.log("N° Registros: " + data.rows.length);

      } else {
        console.log("No existe, hay que agregarlo!");
      }

      // this.setDesocupado();
      return terceros;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }


  addTercero(nombretercero, identificaciontercero, telefonotercero, creaciontercero, modificaciontercero, pkidtercero, tipotercero) {
    let data = [nombretercero, identificaciontercero, telefonotercero, creaciontercero, modificaciontercero, pkidtercero, tipotercero]
    return this.database.executeSql("INSERT INTO ttercero (nombretercero, identificaciontercero, telefonotercero, creaciontercero, modificaciontercero, pkidtercero, tipotercero) VALUES (?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      console.log("Guardado!");
      return data;
    }, err => {
      console.log('Error add: ', err.message, 'NO GUARDADO!');
      return err;
    })
      .catch((error) => {
        console.log('Error catch: ', error.message);
      })
  }

  updateTercero(nombretercero, telefonotercero, modificaciontercero, identificacion) {
    let data = [nombretercero, telefonotercero, modificaciontercero]
    return this.database.executeSql("UPDATE ttercero SET nombretercero = ?,  telefonotercero = ?,  modificaciontercero = ? WHERE identificaciontercero = '" + identificacion + "'", data).then(data => {
      console.log("Actualizado!");
      return data;
    }, err => {
      console.log('Error update: ', err.message, 'NO ACTUALIZADO!');
      return err;
    })
      .catch((error) => {
        console.log('Error catch: ', error.message);
      })
  }


  /**
   * PLAZA
   */

  /**
* Select a la tabla Sector
*/
  getAllPlazas() {
    return this.database.executeSql("SELECT pkidplaza, nombreplaza FROM tplaza ORDER BY nombreplaza", []).then((data) => {

      let plazas = [];
      if (data.rows.length > 0) {
        //  this.setOcupado('Listando Datos Importados');
        for (var i = 0; i < data.rows.length; i++) {
          plazas.push({ pkidsqlite: data.rows.item(i).pkidsqlite, pkidplaza: data.rows.item(i).pkidplaza, nombreplaza: data.rows.item(i).nombreplaza });
        }
        console.log("N° Registros Plazas: " + data.rows.length);

      } else {
        console.log("No hay datos!");
      }

      // this.setDesocupado();
      return plazas;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

  /**
   * SECTOR
   */
  /**
  * Select a la tabla Sector
  */

  getAllSectores() {
    return this.database.executeSql("SELECT * FROM tsector", []).then((data) => {

      let sectores = [];
      if (data.rows.length > 0) {
        // this.setOcupado('Listando Datos Importados');
        for (var i = 0; i < data.rows.length; i++) {
          sectores.push({ pkidsqlite: data.rows.item(i).pkidsqlite, pkidsector: data.rows.item(i).pkidsector, nombresector: data.rows.item(i).nombresector, fkidplaza: data.rows.item(i).fkidplaza, fkidtiposector: data.rows.item(i).fkidtiposector });
        }
        console.log("N° Registros Sectores: " + data.rows.length);

      } else {
        console.log("No hay datos!");
      }

      // this.setDesocupado();
      return sectores;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

  /**
   * RECIBO
   */

  addReciboEventual(pkidrecibopuestoeventual, numerorecibopuestoeventual, valorecibopuestoeventual, creacionrecibopuestoeventual, modificacionrecibopuestoeventual, fkidtarifapuestoeventual, fkidtercero, nombretercero, valortarifa, nombreplaza, recibopuestoeventualactivo, nombreusuario, identificacionusuario, nombresector, fkidsector, sincronizado) {
    let data = [pkidrecibopuestoeventual, numerorecibopuestoeventual, valorecibopuestoeventual, creacionrecibopuestoeventual, modificacionrecibopuestoeventual, fkidtarifapuestoeventual, fkidtercero, nombretercero, valortarifa, nombreplaza, recibopuestoeventualactivo, nombreusuario, identificacionusuario, nombresector, fkidsector, sincronizado]
    return this.database.executeSql("INSERT INTO trecibopuestoeventual (pkidrecibopuestoeventual, numerorecibopuestoeventual, valorecibopuestoeventual, creacionrecibopuestoeventual, modificacionrecibopuestoeventual, fkidtarifapuestoeventual, fkidtercero, nombretercero, valortarifa, nombreplaza, recibopuestoeventualactivo, nombreusuario, identificacionusuario, nombresector, fkidsector, sincronizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      console.log("Recibo Eventual Guardado!");
      return data;
    }, err => {
      console.log('Error add recibo eventual: ', err.message, 'NO GUARDADO!');
      return err;
    })
      .catch((error) => {
        console.log('Error catch RE: ', error.message);
      })
  }

  getAllRecibosEventuales() {
    return this.database.executeSql("SELECT * FROM trecibopuestoeventual", []).then((data) => {

      let recibos = [];
      if (data.rows.length > 0) {
        this.setOcupado('Listando Datos Importados');
        for (var i = 0; i < data.rows.length; i++) {
          //recibos.push({ pkidsqlite: data.rows.item(i).pkidsqlite, pkidsector: data.rows.item(i).pkidsector, nombresector: data.rows.item(i).nombresector, fkidplaza: data.rows.item(i).fkidplaza, fkidtiposector: data.rows.item(i).fkidtiposector });
          recibos.push({
            pkidsqlite: data.rows.item(i).pkidsqlite,
            pkidrecibopuestoeventual: data.rows.item(i).pkidrecibopuestoeventual,
            numerorecibopuestoeventual: data.rows.item(i).numerorecibopuestoeventual,
            valorecibopuestoeventual: data.rows.item(i).valorecibopuestoeventual,
            creacionrecibopuestoeventual: data.rows.item(i).creacionrecibopuestoeventual,
            modificacionrecibopuestoeventual: data.rows.item(i).modificacionrecibopuestoeventual,
            fkidtarifapuestoeventual: data.rows.item(i).fkidtarifapuestoeventual,
            fkidtercero: data.rows.item(i).fkidtercero,
            nombretercero: data.rows.item(i).nombretercero,
            valortarifa: data.rows.item(i).valortarifa,
            nombreplaza: data.rows.item(i).nombreplaza,
            recibopuestoeventualactivo: data.rows.item(i).recibopuestoeventualactivo,
            nombreusuario: data.rows.item(i).nombreusuario,
            identificacionusuario: data.rows.item(i).identificacionusuario,
            nombresector: data.rows.item(i).nombresector,
            fkidsector: data.rows.item(i).fkidsector,
            sincronizado: data.rows.item(i).sincronizado
          });
        }
        console.log("N° Registros Sectores: " + data.rows.length);

      } else {
        console.log("No hay datos!");
      }

      this.setDesocupado();
      return recibos;

    }, err => {
      console.log('Error: ', err.message);
      return [];
    });
  }

}
