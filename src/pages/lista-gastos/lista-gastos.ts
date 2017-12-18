import { GastoDetallePage } from './../gasto-detalle/gasto-detalle';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

/**
 * Generated class for the ListaGastosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-gastos',
  templateUrl: 'lista-gastos.html',
})
export class ListaGastosPage {
  gastos:any;
  montoTotal:any=0;
  constructor(public navCtrl: NavController, public navParams: NavParams,private modalCtrl:ModalController,private viewCtrl:ViewController) {
    this.gastos=this.navParams.get('gastos');
    for(let gasto of this.gastos){
      this.montoTotal=this.montoTotal+gasto.monto;
    }

  }

  itemSelected(item){
    let modal = this.modalCtrl.create(GastoDetallePage,{gasto:item});
    modal.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
