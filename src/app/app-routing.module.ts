import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { NotAuthorizedComponent } from './core/not-authorized/not-authorized.component';
import { DefaultLayoutComponent } from './core/default-layout/default-layout.component';
import { SelectComponent } from './auth/select/select.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
      { path: 'empresa', loadChildren: './empresa/empresa.module#EmpresaModule'},
      { path: 'user', loadChildren: './user/user.module#UserModule'},
      { path: 'contato', loadChildren: './contato/contato.module#ContatoModule'},
      { path: 'unidade', loadChildren: './unidade/unidade.module#UnidadeModule'},
      { path: 'tributacao', loadChildren: './tributacao/tributacao.module#TributacaoModule'},
      { path: 'produto', loadChildren: './produto/produto.module#ProdutoModule'},
      { path: 'nota-fiscal', loadChildren: './nota-fiscal/nota-fiscal.module#NotaFiscalModule'},
      { path: 'conta', loadChildren: './conta/conta.module#ContaModule'},
      { path: 'centro-custos', loadChildren: './centro-custos/centro-custos.module#CentroCustosModule'},
      { path: 'plano-contas', loadChildren: './plano-contas/plano-contas.module#PlanoContasModule'},
      { path: 'lancamento', loadChildren: './lancamento/lancamento.module#LancamentoModule'},
      { path: 'configuracoes', loadChildren: './configuracoes/configuracoes.module#ConfiguracoesModule'},
      { path: 'config-pdv', loadChildren: './config-pdv/config-pdv.module#ConfigPdvModule'}
    ]
  },

  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Autenticação'
    }
  },
  {
    path: 'login/select',
    component: SelectComponent,
    data: {
      title: 'Seleçao de Empresa'
    }
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
    data: {
      title: 'Não Autorizado'
    }
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: {
      title: 'Não Encontrado'
    }
  },
  { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
