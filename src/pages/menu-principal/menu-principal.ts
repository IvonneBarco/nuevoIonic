import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { MenuRecaudoPage } from '../menu-recaudo/menu-recaudo';
import { PlazasPage } from '../plazas/plazas';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MenuPrincipalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-menu-principal',
  templateUrl: 'menu-principal.html',
})
export class MenuPrincipalPage {

  //plazaRecibida: string; //Recibe la plaza para colocar en el titulo del toolbar

  keyPlaza:string ="plazaData";
  _TOKEN: any = "tokenData"; //Recupera el token guardado en el Storage
  TOKEN: any;

  //plaza: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myToastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {

    this.storage.get(this.keyPlaza).then((val) => {
      console.log('Plaza S', val);
    });

    /**
     * Recupera el token que se generó al inicio de sesión
     */
    this.storage.get(this._TOKEN).then((val) => {
      this.TOKEN = val;
      console.log('TOKEN STORAGE', this.TOKEN);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPrincipalPage');
  }

  //Direcciona a la pagina Menu Recaudo
  goToMenuRecaudoPage() {
    //console.log("Plaza enviada a MenuRecaudoPage: " + this.plazaRecibida);
    //this.navCtrl.push(MenuRecaudoPage, {plaza:this.plazaRecibida});
    this.navCtrl.push(MenuRecaudoPage);
  }

  //Mensaje para botones que aun estan en desarrollo
  msjEnDesarrollo() {
    let toast = this.myToastCtrl.create({
      message: 'Sección en Desarrollo',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('toast Dismissed');
    });

    toast.present();
  }

  //Cerrar Sesión
  signDown() {
    
    let loading = this.loadingCtrl.create({
      content: 'Cerrando Sesión...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
      this.storage.remove('tokenData');
      this.navCtrl.setRoot(HomePage);
    }, 1500);
    
  }

  cambiarPlaza(){
    this.navCtrl.push(PlazasPage);
  }


  PressMsj(msj: number) {
    let opcion: string;

    if (msj == 1) {
      opcion = 'Cerrar Sesión'
    }else if (msj == 2) {
      opcion = 'Cambiar Plaza'
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
