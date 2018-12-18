import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ConfiguracoesRoutingModule } from './configuracoes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ConfiguracoesRoutingModule,
    CoreModule,
    SharedModule
  ],
  declarations: [EditComponent]
})
export class ConfiguracoesModule { }
