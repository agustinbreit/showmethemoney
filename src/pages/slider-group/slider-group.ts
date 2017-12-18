import { HomePage } from './../home/home';
import { LoginPage } from './../login/login';
import { Storage } from '@ionic/storage';
import { ApiProvider } from './../../providers/api/api';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Slides } from 'ionic-angular';

/**
 * Generated class for the SliderGroupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-slider-group',
  templateUrl: 'slider-group.html',
})
export class SliderGroupPage {
  items:any;
  hideCreateButton:boolean=true;
  groupName:string="";
  token:string;
  @ViewChild(Slides) slides: Slides;
  canContinue:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,private menuCtrl:MenuController,private api:ApiProvider,public storage:Storage) {
  }

  ionViewDidEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
    this.storage.get('uid').then((user)=>{
      if(user){
      this.token = user;
    } else {
      this.navCtrl.setRoot(LoginPage);
    }
   })
  }

  ionViewDidLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  }

  getItems(ev) {
    this.hideCreateButton=true;
    this.items=[];
    // set val to the value of the ev target
    var val = ev.target.value;
    if (val && val.trim() != '') {
    // if the value is an empty string don't filter the items
    if(val.length>5){
      
      this.api.findGrupos(this.token ,val).then((res)=>{
        let grupos = res.responseBody;
        if(grupos.length>0){
          this.items=grupos;
          this.items = this.items.filter((item) => {
          return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
        }else{
          this.hideCreateButton=false;
          this.groupName=val;
        }
        
      });
     
    }
      
    }
  }

  crearGrupo(){
    this.api.createGroup(this.token ,this.groupName).then((res)=>{
      let grupos = res.responseBody;
      console.log(res);
      this.canContinue=true;
      setTimeout(()=> { 
        this.slides.update();
        this.slides.slideTo(this.slides.length()-1);
        this.slides.lockSwipes(true);
      }, 100);
    });
  }

  addUserToGroup(grupo){
    this.api.updateGroup(this.token ,grupo).then((res)=>{
      let grupos = res.responseBody;
      console.log(grupos);
      this.canContinue=true;
      setTimeout(()=> { 
        this.slides.update();
        this.slides.slideTo(this.slides.length()-1);
        this.slides.lockSwipes(true);
      }, 100);
    
    });
  }

  continuar(){
    this.navCtrl.setRoot(HomePage);
  }


}
