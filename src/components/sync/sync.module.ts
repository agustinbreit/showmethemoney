import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SyncComponent } from './sync';

@NgModule({
  declarations: [
    SyncComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    SyncComponent
  ]
})
export class SyncComponentModule {}
