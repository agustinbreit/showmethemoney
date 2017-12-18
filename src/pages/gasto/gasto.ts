import { ApiProvider } from './../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';

declare var idbKeyval;

const key = 'gastos-sync';

@IonicPage()
@Component({
  selector: 'page-gasto',
  templateUrl: 'gasto.html',
})
export class GastoPage {
  categoryNames:any=[];
  categorias:any;
  subCategory:any=[];
  selectedCategory:any;
  valor:number;
  comentarios:string="";
  token:string;
  date = new Date();
  firstDay:any;
  lastDay:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage:Storage,public api:ApiProvider,public viewCtrl:ViewController,
    public toastCtrl: ToastController,private alertCtrl:AlertController) {
      this.firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
      this.lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  }

  ionViewDidLoad() {
    idbKeyval.get('uid').then((token)=>{
      this.token=token;
      idbKeyval.get('categorias').then((categorias)=>{
        if(categorias && categorias.length>0){
          this.createCategoryGroups(categorias);
          this.categorias=categorias;
        }else{
          this.api.getCategorias(token).then((res)=>{
            this.createCategoryGroups(res.responseBody);
            this.categorias=res.responseBody;
            idbKeyval.set('categorias',this.categorias);
          });
        }
      });
    });
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  createCategoryGroups(categorias){
    
    for(let categoria of categorias){
      if(!(this.categoryNames.indexOf(categoria.categoria) > -1)){
        this.categoryNames.push(categoria.categoria);
      }
    }
  }

  onChangeCategoryName(val){
   if(val){
    this.subCategory=[];
    this.filterCategoryByName(val);
   }
    
  }
  filterCategoryByName(val){
    for(let categoria of this.categorias){
      if(categoria.categoria==val){
        this.subCategory.push(categoria);
      }
    }
  }

  onChangeSubcategory(val){
    if(val){
      this.selectedCategory=this.findCategoryById(val);
    }
  }
  findCategoryById(val){
    for(let category of this.categorias){
      if(category.id==val){
        return category;
      }
    }
  }

  agregarGasto(){
    
    if(this.valor==0 || this.selectedCategory==null){
      if(this.valor==0){this.presentToast("Tenes que seleccionar una categoria");return;}
      if(this.selectedCategory==null){this.presentToast("Elige una Categoria");return;}
    }else{
      let gasto = {token:this.token,gasto:{categoria:this.selectedCategory,descripcion:this.comentarios,monto:this.valor}};
      this.addToOutbox(gasto)
      .then(msg => navigator.serviceWorker.ready)
      .then(reg => {
          this.registerSyncEvent(reg).then((res)=>{
            //console.log(res);
            setTimeout(()=>{
              this.presentConfirm();
            }, 500)
          }
            
          );
         
        })
      .catch(() => this.sendExpense())
      .catch(err => console.log('no se pudo enviar el mensaje al servidor', err));
     
    }

  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Gasto Ingresado',
      message: 'Deseas ingresar otro?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          handler: () => {
            if(this.token){  
              this.api.findGastosByGruposByPeriod(this.token, this.getFormattedDate(this.firstDay),this.getFormattedDate(this.lastDay)).then(()=>{
                this.dismiss();
              })
            }
           
          }
        },
        {
          text: 'Si',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }
  
  getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return day + '-' + month + '-' + year;
}
  

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  private registerSyncEvent(reg) {
    return reg.sync
      .register('gasto-pwa')
      .then((res) => console.log(res))
      .catch(() => console.log('Sync - registracion fallida'));
  }


  private sendExpense() {
    let body = {categoria:this.selectedCategory,descripcion:this.comentarios,monto:this.valor}
    this.api.agregarGasto(this.token,body).then((res)=>{
      //console.log(res);
      this.removeLastExpenseFromOutBox();
      this.presentConfirm();
    });
  }


  private addToOutbox(gasto) {
    return idbKeyval
      .get(key)
      .then(data => this.addExpenseToArray(data, gasto))
      .then(messages => idbKeyval.set(  key, JSON.stringify(messages)));
  }

  private addExpenseToArray(data, message) {
    data = data || '[]';
    const messages = JSON.parse(data) || [];
    messages.push(message);
    return messages;
  }

  private removeLastExpenseFromOutBox() {
    return this.getExpenseFromOutbox()
      .then(messages => messages.pop())
      .then(messages => idbKeyval.set(key, JSON.stringify(messages)))
      .then(() => console.log('mensaje extraido de bandeja de salida'))
      .catch(err => console.log('error al intentar extraer un mensaje de bandeja de salida', err));
  }

  private getExpenseFromOutbox() {
    return idbKeyval.get(key).then(values => {
      values = values || '[]';
      const messages = JSON.parse(values) || [];
      return messages;
    });
  }




}
