import { LancamentoService } from './../lancamento.service';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as moment from 'moment';

import { EmpresaService } from '../../empresa/empresa.service';
import { ContatoSelectComponent } from '../../contato/contato-select/contato-select.component';
import { ContaSelectComponent } from '../../conta/select/select.component';
import { PlanoContasSelectComponent } from '../../plano-contas/select/select.component';
import { CentroCustosSelectComponent } from '../../centro-custos/select/select.component';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  TpLancamento: any = [];
  TpPagamento: any = [];

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private service: LancamentoService
  ) {
      this.registro = registro;

      moment.locale('pt-br');

      service.loadTpLancamento().subscribe(data => this.TpLancamento = data, erro => this.errorHandler.handle(erro));
      service.loadTpPagamento().subscribe(data => this.TpPagamento = data, erro => this.errorHandler.handle(erro));

      if (!this.registro.tpLancamento) { this.registro.tpLancamento = { valor: 'C' }; }
      if (!this.registro.tpPagamento) { this.registro.tpPagamento = { valor: '01' }; }
      if (!this.registro.conta) { this.registro.conta = {}; }
      if (!this.registro.planoContas) { this.registro.planoContas = {tpConta: { valor: 'N' }}; }
      if (!this.registro.centroCustos) { this.registro.centroCustos = {}; }

      if (!this.registro.contato) {
        this.registro.contato = {
          municipio: {},
          pais: {}
        };
      }

    if (this.registro.competencia) {
      const time = moment(this.registro.competencia, 'YYYY-MM-DD hh:mm:ss A Z');
      this.registro.competencia = time.format('DD/MM/YYYY HH:mm:ss');
    } else {
      this.registro.competencia = moment().format('DD/MM/YYYY HH:mm:ss');
    }
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {}

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      id: [registro.id],
      competencia: [registro.competencia],
      contato: this.buildContato(registro.contato),
      descricao: [registro.descricao],
      documento: [registro.documento],
      valor: [registro.valor, Validators.required],
      tpLancamento: this.fb.group({
        valor: [registro.tpLancamento.valor],
        desc: [registro.tpLancamento.descricao]
      }),
      tpPagamento: this.fb.group({
        valor: [registro.tpPagamento.valor],
        desc: [registro.tpPagamento.descricao]
      }),
      conta: this.buildConta(registro.conta),
      planoContas:  this.buildPlanoContas(registro.planoContas),
      centroCustos: this.buildCentroCustos(registro.centroCustos),
      obs: [registro.obs],
    });
  }

  buildContato(registro) {
    return this.fb.group({
      active: [registro.active],
      bairro: [registro.bairro],
      bloqueado: [registro.bloqueado],
      celular: [registro.celular],
      cep: [registro.cep],
      clienteDistribuidor: [registro.clienteDistribuidor],
      clienteRevendedor: [registro.clienteRevendedor],
      codigo: [registro.codigo],
      complemento: [registro.complemento],
      contato: [registro.contato],
      createdAt: [registro.createdAt],
      desabilitado: [registro.desabilitado],
      email: [registro.email],
      empresa: [this.empresaService.getEmpresaAtiva()],
      fantasia: [registro.fantasia],
      fone: [registro.fone],
      foneRes: [registro.foneRes],
      fornecedor: [registro.fornecedor],
      id: [registro.id],
      ie: [registro.ie],
      indIEDest: [registro.indIEDest],
      isuf: [registro.isuf],
      logradouro: [registro.logradouro],
      municipio: this.fb.group({
        active: [registro.municipio.active],
        cMun: [registro.municipio.cMun],
        createdAt: [registro.municipio.createdAt],
        id: [registro.municipio.id],
        uf: [registro.municipio.uf],
        updatedAt: [registro.municipio.updatedAt],
        xMun: [registro.municipio.xMun]
      }),
      nome: [registro.nome, Validators.required],
      numDoc: [registro.numDoc],
      numero: [registro.numero],
      obs: [registro.obs],
      pais: this.fb.group({
        active: [registro.pais.active],
        cPais: [registro.pais.cPais],
        createdAt: [registro.pais.createdAt],
        id: [registro.pais.id],
        updatedAt: [registro.pais.updatedAt],
        xPais: [registro.pais.xPais]
      }),
      tpDoc: [registro.tpDoc],
      transportador: [registro.transportador],
      updatedAt: [registro.updatedAt]
    });
  }

  buildConta(registro) {
    return this.form = this.fb.group({
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      id: [registro.id],
      descricao: [registro.descricao, Validators.required],
      saldo: [registro.saldo]
    });
  }

  buildPlanoContas(registro) {
    return this.form = this.fb.group({
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      id: [registro.id],
      descricao: [registro.descricao, Validators.required],
      codigo: [registro.codigo],
      tpConta: this.fb.group({
        valor: [registro.tpConta.valor],
        desc: [registro.tpConta.descricao]
      })
    });
  }

  buildCentroCustos(registro) {
    return this.form = this.fb.group({
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      id: [registro.id],
      descricao: [registro.descricao, Validators.required]
    });
  }

  changeContato() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '95%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(ContatoSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('contato').patchValue(register);
        }
      }
    );
  }

  changeConta() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    // dialogConfig.width = '95%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(ContaSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('conta').patchValue(register);
        }
      }
    );
  }

  changePlanoContas() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    // dialogConfig.width = '50%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(PlanoContasSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('planoContas').patchValue(register);
        }
      }
    );
  }

  changeCentroCustos() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    // dialogConfig.width = '50%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(CentroCustosSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('centroCustos').patchValue(register);
        }
      }
    );
  }

  changeTpLancamento(event) {
    this.form.get('tpLancamento').patchValue(this.TpLancamento.find(element => element.valor === event.value));
  }

  changeTpPagamento(event) {
    this.form.get('tpPagamento').patchValue(this.TpPagamento.find(element => element.valor === event.value));
  }

  save() {
    const competencia = moment(this.form.get('competencia').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('competencia').setValue(competencia);
    this.dialogRef.close(this.form.value);
  }

  close() {
    const competencia = moment(this.form.get('competencia').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('competencia').setValue(competencia);
    this.dialogRef.close();
  }

}
