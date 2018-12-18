import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { NotaFiscalRoutingModule } from './nota-fiscal-routing.module';
import { SharedModule } from '../shared/shared.module';
import { EditItemComponent } from './edit-item/edit-item.component';
import { CancelarComponent } from './cancelar/cancelar.component';


@NgModule({
  imports: [
    CommonModule,
    NotaFiscalRoutingModule,
    SharedModule
  ],
  declarations: [ListComponent, EditComponent, EditItemComponent, CancelarComponent],
  entryComponents: [EditItemComponent, CancelarComponent]
})
export class NotaFiscalModule { }
