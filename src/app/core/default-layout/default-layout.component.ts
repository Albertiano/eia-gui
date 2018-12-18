import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComponentPageTitle } from '../../shared/page-title';
import { EmpresaService } from '../../empresa/empresa.service';

@Component({
  selector: 'eia-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        // result.matches
        return true;
      })
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public _componentPageTitle: ComponentPageTitle,
    private empresaService: EmpresaService) {}

  toggle(drawer) {
    if (drawer.mode === 'over') {
      drawer.toggle();
    }
  }

  getTitle() {
    return this._componentPageTitle.title;
  }

  getEmpresa() {
    return this.empresaService.getEmpresaAtiva().fantasia;
  }

  }
