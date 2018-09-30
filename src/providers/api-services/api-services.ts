import { GLOBAL } from './../fecha/globales';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ApiServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiServicesProvider {

  public API_URL: string;
  public headers;

  //Storage
  _TOKEN: any = "tokenData"; //Recupera el token guardado en el Storage
  TOKEN: any;

  constructor(
    public http: Http,
    private storage: Storage

  ) {
    this.API_URL = GLOBAL.url;
    this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });

    this.storage.get(this._TOKEN).then((val) => {
      this.TOKEN = val;
      //console.log('TOKEN STORAGE en plaza', val);
    });
    
  }

  login(login) {

    let json = JSON.stringify(login);
    //console.log("JSON: ", json);

    let parametros = "json=" + json;

    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL + 'login', parametros, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    }).catch((error) => {
      console.error('API Error: ', error.status);
      console.error('API Error: ', JSON.stringify(error));
    })
  }


  //Agrega recibo al servidor
  addReciboEventual(rec) {

    let json = JSON.stringify(rec);
    console.log("JSON: " + json);
    let parametros = "authorization=" + this.TOKEN + "&json=" + json;

    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL + '/recibopuestoeventual/new', parametros, { headers: this.headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        })
    }).catch((error) => {
      console.error('API Error: ', error.status);
      console.error('API Error: ', JSON.stringify(error));
    })
  }


}
