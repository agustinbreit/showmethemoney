import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the GastoDetallePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gasto-detalle',
  templateUrl: 'gasto-detalle.html',
})
export class GastoDetallePage {
  gasto:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
    this.gasto=this.navParams.get('gasto');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
