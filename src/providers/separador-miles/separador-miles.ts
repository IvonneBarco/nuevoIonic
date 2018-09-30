import { Injectable } from '@angular/core';

/*
  Generated class for the SeparadorMilesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SeparadorMilesProvider {

  DECIMAL_SEPARATOR = ".";
  GROUP_SEPARATOR = ",";
  budget = 0;

  constructor() {
    console.log('Hello SeparadorMilesProvider Provider');
  }

  //para miles
  
  format(valString) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR)

  }

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

  }

}
