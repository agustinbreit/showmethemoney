import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaGastosPage } from './lista-gastos';

@NgModule({
  declarations: [
    ListaGastosPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaGastosPage),
  ],
})
export class ListaGastosPageModule {}
