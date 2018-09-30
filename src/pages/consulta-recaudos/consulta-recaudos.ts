import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RecaudoPuestosFijosPage } from '../recaudo-puestos-fijos/recaudo-puestos-fijos';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ConsultaRecaudosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-consulta-recaudos',
  templateUrl: 'consulta-recaudos.html',
})

export class ConsultaRecaudosPage {

  //plazaRecibida: string; //Recibe la plaza para colocar en el titulo del toolbar
  zona: string;
  sector: string;

  keyPlaza: string = "plazaData";
  miplaza: any = '';
  
  public press: number = 0;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myToastCtrl: ToastController,
    private storage: Storage
  ) {

    this.storage.get(this.keyPlaza).then(
      (val) => {
        this.miplaza = val;
        //console.log('Plaza Storage', val);
        console.log('Plaza Storage', this.miplaza);
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConsultaRecaudosPage');
  }

  goToRecaudo(id) {
    console.log("Usuario: " + id);
    this.navCtrl.push(RecaudoPuestosFijosPage, { id, zona: this.zona, sector: this.sector });
  }


  PressMsj(msj: number) {
    let opcion: string;

    if (msj == 1) {
      opcion = 'Recaudar'
    }else if (msj == 2) {
      opcion = 'Historico de Pagos'
    } else if (msj == 3) {
      opcion = 'Se visitó, pero no pagó'
    }

    let toast = this.myToastCtrl.create({
      message: opcion,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('toast Dismissed');
    });

    toast.present();
  }
}
