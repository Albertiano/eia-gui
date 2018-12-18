import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EmpresaService } from '../../empresa/empresa.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { PlanoContasService } from '../plano-contas.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  TpConta: any = [];

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private empresaService: EmpresaService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private service: PlanoContasService,
  ) {
      this.registro = registro;

      if (!this.registro.tpConta) { this.registro.tpConta = { valor: 'N' }; }

      service.loadTpConta().subscribe(data => this.TpConta = data, erro => this.errorHandler.handle(erro));
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
      descricao: [registro.descricao],
      codigo: [registro.codigo],
      tpConta: this.fb.group({
        valor: [registro.tpConta.valor],
        desc: [registro.tpConta.descricao]
      })
    });
  }

  changeTpConta(event) {
    this.form.get('tpConta').patchValue(this.TpConta.find(element => element.valor === event.value));
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
