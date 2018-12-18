import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EmpresaService } from '../../empresa/empresa.service';
import { UnidadeSelectComponent } from './../../unidade/select/select.component';
import { TributacaoSelectComponent } from '../../tributacao/tributacao-select/tributacao-select.component';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro}
  ) {
      this.registro = registro;

      if (!this.registro.unidade) {
        this.registro.unidade = {};
      }

      if (!this.registro.utrib) {
        this.registro.utrib = {};
      }

      if (!this.registro.tributacao) {
        this.registro.tributacao = {};
      }

      if (!this.registro.cEan) {
        this.registro.cEan = 'SEM GTIN';
      }

      if (!this.registro.cEanTrib) {
        this.registro.cEanTrib = 'SEM GTIN';
      }
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {}

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      id: [registro.id],
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      codigo: [registro.codigo],
      referencia: [registro.referencia],
      descricao: [registro.descricao],
      unidade: this.fb.group({
        active: [registro.unidade.active],
        createdAt: [registro.unidade.createdAt],
        updatedAt: [registro.unidade.updatedAt],
        id: [registro.unidade.id],
        sigla: [registro.unidade.sigla],
        desc: [registro.unidade.desc]
      }),
      ncm: [registro.ncm],
      cest: [registro.cest],
      precoVenda: [registro.precoVenda],
      pesoBruto: [registro.pesoBruto],
      pesoLiquido: [registro.pesoLiquido],
      localizacao: [registro.localizacao],
      tributacao: this.fb.group({
        active: [registro.tributacao.active],
        createdAt: [registro.tributacao.createdAt],
        updatedAt: [registro.tributacao.updatedAt],
        id: [registro.tributacao.id],
        nome: [registro.tributacao.nome],
        descricao: [registro.tributacao.descricao]
      }),
      estoque: [registro.estoque],
      cEan: [registro.cEan],
      cEanTrib: [registro.cEanTrib],
      utrib: this.fb.group({
        active: [registro.utrib.active],
        createdAt: [registro.utrib.createdAt],
        updatedAt: [registro.utrib.updatedAt],
        id: [registro.utrib.id],
        sigla: [registro.utrib.sigla],
        desc: [registro.utrib.desc]
      }),
      vuntrib: [registro.vuntrib]
    });
  }

  changeUnidade() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '50%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(UnidadeSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('unidade').patchValue(register);
          this.form.get('utrib').patchValue(register);
        }
      }
    );
  }

  changeUnidadeTrib() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '50%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(UnidadeSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('utrib').patchValue(register);
        }
      }
    );
  }

  changeTributacao() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '50%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(TributacaoSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.form.get('tributacao').patchValue(register);
        }
      }
    );
  }

  updateVuntrib() {
    const valor = this.form.get('precoVenda').value;
    this.form.get('vuntrib').setValue(valor);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    console.log(this.form.value);
    this.dialogRef.close();
  }

}
