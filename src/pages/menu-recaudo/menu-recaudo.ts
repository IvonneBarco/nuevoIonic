import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PlazasPage } from '../plazas/plazas';
import { ConsultaRecaudosPage } from '../consulta-recaudos/consulta-recaudos';
import { RecaudoPuestosEventualesPage } from '../recaudo-puestos-eventuales/recaudo-puestos-eventuales';

/**
 * Generated class for the MenuRecaudoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-menu-recaudo',
  templateUrl: 'menu-recaudo.html',
})
export class MenuRecaudoPage {

  //plazaRecibida: string; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public myToastCtrl: ToastController
  ) {

    //this.plazaRecibida = navParams.get('plaza')
    //console.log("Plaza recibida de MenuPrincipal: " + this.plazaRecibida);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuRecaudoPage');
  }

  //Direcciona a la pagina Recaudo de puestos fijos
  goToMenuRecaudoPuestosFijosPage(){
    //console.log("Plaza enviada a ConsultaRecaudosPage: " + this.plazaRecibida);
    this.navCtrl.push(ConsultaRecaudosPage);
  }

   //Direcciona a la pagina Recaudo de puestos eventuales
   goToMenuRecaudoPuestosEventualesPage(){
    //console.log("Plaza enviada a ConsultaRecaudosPage: " + this.plazaRecibida);
    this.navCtrl.push(RecaudoPuestosEventualesPage);
  }

  //Mensaje para botones que aun estan en desarrollo
  msjEnDesarrollo() {
    let toast = this.myToastCtrl.create({
      message: 'Sección en Desarrollo' ,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('toast Dismissed');
    });

    toast.present();
  }

}
