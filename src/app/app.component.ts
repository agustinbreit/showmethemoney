import { SliderGroupPage } from './../pages/slider-group/slider-group';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../pages/login/login';
import { AuthProvider } from './../providers/auth/auth';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private authProvider:AuthProvider,public alertCtrl:AlertController,
      private storage:Storage) {

      let user = this.storage.get('uid');
      user.then((user)=>{
         if(user){
         this.authProvider.setLoggedUserData(user);
         
         this.rootPage = HomePage;
         //authObserver.unsubscribe();
         //this.nav.setRoot(this.rootPage);
       } else {
         //this.rootPage = LoginPage;
         this.rootPage = LoginPage;
         //authObserver.unsubscribe();
         //this.nav.setRoot(this.rootPage);
       }
      })
       

    
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }


  logOut(){
      this.storage.remove('uid');
      this.storage.remove('userName');
      this.nav.setRoot(LoginPage);
  }


}
