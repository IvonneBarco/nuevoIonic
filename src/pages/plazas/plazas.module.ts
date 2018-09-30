import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlazasPage } from './plazas';

@NgModule({
  declarations: [
    PlazasPage,
  ],
  imports: [
    IonicPageModule.forChild(PlazasPage),
  ],
})
export class PlazasPageModule {}
