import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SelectComponent } from './select/select.component';



@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule
  ],
  providers: [
  ],
  declarations: [LoginComponent, SelectComponent]
})
export class AuthModule { }
