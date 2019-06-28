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
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'empresa',
        loadChildren: () => import('./empresa/empresa.module').then(m => m.EmpresaModule)
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule)
      },
      {
        path: 'contato',
        loadChildren: () => import('./contato/contato.module').then(m => m.ContatoModule)
      },
      {
        path: 'unidade',
        loadChildren: () => import('./unidade/unidade.module').then(m => m.UnidadeModule)
      },
      {
        path: 'tributacao',
        loadChildren: () => import('./tributacao/tributacao.module').then(m => m.TributacaoModule)
      },
      {
        path: 'produto',
        loadChildren: () => import('./produto/produto.module').then(m => m.ProdutoModule)
      },
      {
        path: 'nota-fiscal',
        loadChildren: () => import('./nota-fiscal/nota-fiscal.module').then(m => m.NotaFiscalModule)
      },
      {
        path: 'conta',
        loadChildren: () => import('./conta/conta.module').then(m => m.ContaModule)
      },
      {
        path: 'centro-custos',
        loadChildren: () => import('./centro-custos/centro-custos.module').then(m => m.CentroCustosModule)
      },
      {
        path: 'plano-contas',
        loadChildren: () => import('./plano-contas/plano-contas.module').then(m => m.PlanoContasModule)
      },
      {
        path: 'lancamento',
        loadChildren: () => import('./lancamento/lancamento.module').then(m => m.LancamentoModule)
      },
      {
        path: 'configuracoes',
        loadChildren: () => import('./configuracoes/configuracoes.module').then(m => m.ConfiguracoesModule)
      },
      {
        path: 'config-pdv',
        loadChildren: () => import('./config-pdv/config-pdv.module').then(m => m.ConfigPdvModule)
      }
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
