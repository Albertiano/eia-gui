import { CepDirective } from './directives/cep.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { CoreModule } from './../core/core.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { UnidadeSelectComponent } from '../unidade/select/select.component';
import { TributacaoSelectComponent } from '../tributacao/tributacao-select/tributacao-select.component';
import { ContatoSelectComponent } from '../contato/contato-select/contato-select.component';
import { ProdutoSelectComponent } from '../produto/produto-select/produto-select.component';
import { IcmsComponent } from '../tributacao/icms/icms.component';
import { CpfCnpjDirective } from './directives/cpf-cnpj.directive';
import { DateTimeDirective } from './directives/date-time.directive';
import { FoneDirective } from './directives/fone.directive';
import { MomentPipe } from './pipes/moment.pipe';
import { NumeroDirective } from './directives/numero.directive';
import { ContaSelectComponent } from '../conta/select/select.component';
import { CentroCustosSelectComponent } from '../centro-custos/select/select.component';
import { PlanoContasSelectComponent } from '../plano-contas/select/select.component';
import { IpiComponent } from '../tributacao/ipi/ipi.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    CoreModule
  ],
  exports: [
    MatDialogModule,
    CoreModule,
    CpfCnpjDirective,
    DateTimeDirective,
    CepDirective,
    FoneDirective,
    MomentPipe,
    NumeroDirective,
    IcmsComponent,
    IpiComponent
  ],
  declarations: [
    ConfirmDialogComponent,
    UnidadeSelectComponent,
    TributacaoSelectComponent,
    ContatoSelectComponent,
    ProdutoSelectComponent,
    ContaSelectComponent,
    CentroCustosSelectComponent,
    PlanoContasSelectComponent,
    IcmsComponent,
    IpiComponent,
    CpfCnpjDirective,
    DateTimeDirective,
    CepDirective,
    FoneDirective,
    MomentPipe,
    NumeroDirective
  ],
  entryComponents: [
    ConfirmDialogComponent,
    UnidadeSelectComponent,
    TributacaoSelectComponent,
    ContatoSelectComponent,
    ProdutoSelectComponent,
    ContaSelectComponent,
    CentroCustosSelectComponent,
    PlanoContasSelectComponent,
    IcmsComponent,
    IpiComponent
  ]
})
export class SharedModule { }
