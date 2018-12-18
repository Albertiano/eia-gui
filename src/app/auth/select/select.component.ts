import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmpresaService } from '../../empresa/empresa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'eia-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  props = {
    sortBy: 'nome',
    page: 0,
    rowsPerPage: 8,
    filter: ''
  };
  empresas: any = [];
  empresa: any;

  constructor(
    private router: Router,
    private errorHandler: ErrorHandlerService,
    public empresaService: EmpresaService
  ) { }

  ngOnInit() {
    this.carregarEmpresas();
  }

  carregarEmpresas () {
    this.empresaService.loadRegistros(this.props)
      .subscribe(result => {
        this.empresas = result['content'];
      });
  }

  confirmarEmpresa () {
    const registro = this.empresas.find(element => element.id === this.empresa);
    this.empresaService.setEmpresaAtiva(registro);
    this.router.navigate(['/']);
  }

}
