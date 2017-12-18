import { SyncComponentModule } from './../components/sync/sync.module';
import { PushNotificationsComponentModule } from './../components/push-notifications/push-notifications.module';
import { GastoDetallePageModule } from './../pages/gasto-detalle/gasto-detalle.module';
import { ListaGastosPageModule } from './../pages/lista-gastos/lista-gastos.module';

import { GastoPageModule } from './../pages/gasto/gasto.module';
import { SliderGroupPageModule } from './../pages/slider-group/slider-group.module';
import { SignupPageModule } from './../pages/signup/signup.module';
import { LoginPageModule } from './../pages/login/login.module';
import { AuthProvider } from './../providers/auth/auth';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SyncComponent } from '../components/sync/sync';
import { IonicStorageModule ,Storage} from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { ApiProvider } from '../providers/api/api';
import { Settings } from './../utils/settings';

const firebaseConfig = {
  apiKey: "AIzaSyBK4aiONRnQoELokTSQvcDQA5vkxza_9CU",
  authDomain: "smtm-b6f56.firebaseapp.com",
  databaseURL: "https://smtm-b6f56.firebaseio.com",
  projectId: "smtm-b6f56",
  storageBucket: "smtm-b6f56.appspot.com",
  messagingSenderId: "43118194986"
};
// export function provideSettings(storage: Storage) {
//   /**
//    * The Settings provider takes a set of default settings for your app.
//    *
//    * You can add new settings options at any time. Once the settings are saved,
//    * these values will not overwrite the saved values (this can be done manually if desired).
//    */
//   return new Settings(storage, {
//     option1: true,
//     option2: 'Ionitron J. Framework',
//     option3: '3',
//     option4: 'Hello'
//   });
// }


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'smtmdb',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }) ,
    LoginPageModule,
    SignupPageModule,
    HttpModule,
    SliderGroupPageModule,
    GastoPageModule,
    ListaGastosPageModule,
    GastoDetallePageModule,
    PushNotificationsComponentModule,
    SyncComponentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    ApiProvider
  ]
})
export class AppModule {}
