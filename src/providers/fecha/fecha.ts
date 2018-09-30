import { GLOBAL } from './globales';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the FechaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FechaProvider {

  public URL: string;
  public headers;

  constructor(public http: HttpClient) {
    console.log('Hello FechaProvider Provider');
    this.URL = GLOBAL.url;
    this.headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
  }

  traerFechaActual() {
    return this.http
      .get(this.URL + 'today')
      .toPromise();
  }

}
