import { SliderGroupPage } from './../slider-group/slider-group';
import { Storage } from '@ionic/storage';
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
import { HomePage } from '../home/home';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;

  constructor(public nav: NavController, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController, 
    public alertCtrl: AlertController, public storage:Storage, public menuCtrl: MenuController) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      displayName: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  /**
   * If the form is valid it will call the AuthData service to sign the user up password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authData.registerUser(this.signupForm.value.displayName ,this.signupForm.value.email, this.signupForm.value.password)
      .then((user) => {
        
        // let usuario = [];
        // usuario['userName']=this.signupForm.value.displayName;
        // let token=[];
        // token['uid']= user.rawResponse.id_token
      this.storage.set('userName',this.signupForm.value.displayName).then((res)=>{console.log(res)}).catch(function(err) {console.log(err)});
      this.storage.set('uid', user.rawResponse.id_token).then((res)=>{console.log(res)}).catch(function(err) {console.log(err)});
        this.nav.setRoot(SliderGroupPage);
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
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


  ionViewDidEnter() {
    // the left menu should be disabled on the login page
    this.menuCtrl.enable(false);
  }

  ionViewDidLeave() {
    // enable the left menu when leaving the login page
    this.menuCtrl.enable(true);
  }


}