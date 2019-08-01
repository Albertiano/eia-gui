import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import localePt from '@angular/common/locales/pt';

import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatGridListModule,
  MatTabsModule,
  MatDatepickerModule,
  MatChipsModule,
  MatMenuModule,
  MatCheckboxModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthHttp } from '../auth/auth-http';

registerLocaleData(localePt, 'pt');

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  exports: [
    LayoutModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatGridListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatChipsModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  providers: [
    Title,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: 'pt-br' },
    AuthHttp
  ],
  declarations: [DefaultLayoutComponent, NotAuthorizedComponent, NotFoundComponent],
})
export class CoreModule { }
