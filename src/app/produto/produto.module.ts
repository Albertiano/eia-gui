import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { ProdutoRoutingModule } from './produto-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProdutoRoutingModule,
    SharedModule
  ],
  declarations: [ListComponent, EditComponent]
})
export class ProdutoModule { }
