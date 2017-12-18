import { ListaGastosPage } from './../../pages/lista-gastos/lista-gastos';
import { ToastController, ModalController } from 'ionic-angular';
import { ApiProvider } from './../../providers/api/api';

import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
//import { Auth, User, UserDetails, IDetailedError } from '@ionic/cloud-angular';
import { Storage } from '@ionic/storage';
declare var idbKeyval;

const key = 'gastos-sync';

@Component({
  selector: 'sync',
  templateUrl: 'sync.html',
  //providers:{ApiProvider}
})
export class SyncComponent implements OnInit {
  fechaInicio:any;
  fechaFin:any;
  _fechaInicio:any;
  _fechaFin:any;
  token:any;
  constructor(private storage:Storage,private toastCtrl:ToastController,private modalCtrl:ModalController,private api:ApiProvider) {
  //  this.afAuth.authState.subscribe((authData) => {
  //     this.user = authData.uid;
  //     console.log(authData);
  //   }, error => {
  //     console.log(error)
  //   });
  this.fechaInicio=this.getFormattedDate(new Date());
  this.fechaFin=this.getFormattedDate(new Date());
  }

  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-'+day;
}

  ngOnInit() {}

  getGastos(){
    if(this.token){
      this.api.findGastosByGruposByPeriod(this.token, this._fechaInicio,this._fechaFin).then((res)=>{
        //console.log(res);
        if(res.isOk){
          this.openModal(res.rawResponse);
        }
      }).catch((e)=>{
        return [];
      });
    }
    
  }
  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }
  buttonClick(){
    this.storage.get('uid').then((token)=>{
      let ini = this.fechaInicio.split('-');
      let fin= this.fechaFin.split('-');
      this._fechaInicio=ini[2]+'-'+ini[1]+'-'+ini[0];
      this._fechaFin=fin[2]+'-'+fin[1]+'-'+fin[0];
      this.token=token;
      this.getGastos();
     
    });
  }
  openModal(gastos){
    let modal = this.modalCtrl.create(ListaGastosPage,{gastos:gastos});
    modal.present();
  }

}