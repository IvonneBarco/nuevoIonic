import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracionesPage } from './configuraciones';

@NgModule({
  declarations: [
    ConfiguracionesPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfiguracionesPage),
  ],
})
export class ConfiguracionesPageModule {}
