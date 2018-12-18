import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [ListComponent, EditComponent],
  providers: [
  ]
})
export class EmpresaModule { }
