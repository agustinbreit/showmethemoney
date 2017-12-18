import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { PushNotificationsComponent } from './push-notifications';

@NgModule({
  declarations: [
    PushNotificationsComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    PushNotificationsComponent
  ]
})
export class PushNotificationsComponentModule {}
