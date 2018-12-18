import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ADMIN'] }
  },
  {
    path: ':id',
    component: EditComponent,
    canActivate: [ AuthGuard ],
    data: { roles: ['ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LancamentoRoutingModule { }
