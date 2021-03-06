import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { ConfigPdvService } from './config-pdv/config-pdv.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { ComponentPageTitle } from './shared/page-title';
import { environment } from '../environments/environment';
import { EmpresaService } from './empresa/empresa.service';
import { PaisService } from './shared/pais.service';
import { MunicipioService } from './shared/municipio.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: environment.tokenWhitelistedDomains,
        blacklistedRoutes: environment.tokenBlacklistedRoutes
      }
    }),
    CoreModule,
    AuthModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt' },
    ComponentPageTitle,
    PaisService,
    MunicipioService,
    EmpresaService,
    ConfigPdvService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
