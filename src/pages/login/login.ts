import { SignupPage } from './../signup/signup';
import { ResetPasswordPage } from './../reset-password/reset-password';
import { ApiProvider } from './../../providers/api/api';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavController, 
  LoadingController, 
  Loading, 
  AlertController,
  MenuController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { Storage } from '@ionic/storage';

declare var idbKeyval;
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;

  constructor(public navCtrl: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public storage:Storage, public menuCtrl: MenuController,private api:ApiProvider) {
      
      this.loginForm = formBuilder.group({
        username: ['', Validators.compose([Validators.minLength(5), Validators.required])],
        password: ['', Validators.compose([Validators.minLength(5), Validators.required])]
      });
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      } else {
        this.authData.loginUser(this.loginForm.value.username, this.loginForm.value.password)
        .then( authData => {
          if(authData.isOk){
            // let usuario = [];
            // usuario['userName']=this.loginForm.value.username;
            // let token=[];
            // token['uid']=authData.rawResponse.id_token
            idbKeyval.set('userName',this.loginForm.value.username).then((res)=>{console.log(res)}).catch(function(err) {console.log(err)});
            idbKeyval.set('uid', authData.rawResponse.id_token).then((res)=>{console.log(res)}).catch(function(err) {console.log(err)});
          this.navCtrl.setRoot(HomePage);
          
          }else{
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: authData.statusText,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
            });
          }
         
        }, error => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
  }


  ionViewDidEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  }
}
