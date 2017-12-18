import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GastoDetallePage } from './gasto-detalle';

@NgModule({
  declarations: [
    GastoDetallePage,
  ],
  imports: [
    IonicPageModule.forChild(GastoDetallePage),
  ],
})
export class GastoDetallePageModule {}
