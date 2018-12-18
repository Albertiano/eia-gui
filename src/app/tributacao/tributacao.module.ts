import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TributacaoRoutingModule } from './tributacao-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { DestinoComponent } from './destino/destino.component';
import { DestinoEditComponent } from './destino-edit/destino-edit.component';
import { IpiComponent } from './ipi/ipi.component';

@NgModule({
  imports: [
    CommonModule,
    TributacaoRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [ListComponent, EditComponent, DestinoComponent, DestinoEditComponent],
  entryComponents: [DestinoEditComponent]
})
export class TributacaoModule { }
