import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LancamentoRoutingModule } from './lancamento-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    LancamentoRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [ListComponent, EditComponent]
})
export class LancamentoModule { }
