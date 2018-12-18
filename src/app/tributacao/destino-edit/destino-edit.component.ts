import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { TributacaoService } from '../tributacao.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'eia-destino-edit',
  templateUrl: './destino-edit.component.html',
  styleUrls: ['./destino-edit.component.scss']
})
export class DestinoEditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  cstsICMS: any;
  origens: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DestinoEditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private service: TributacaoService
  ) {
      this.registro = registro;

      this.service.loadCstICMS().subscribe(data => {
        this.cstsICMS = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });

      this.service.loadOrigem().subscribe(data => {
        this.origens = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {}

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      cfop: [registro.cfop],
      estado: [registro.estado],
      icms: this.fb.group({
        cstICMS: this.fb.group({
          descricao: [registro.icms.cstICMS.descricao],
          valor: [registro.icms.cstICMS.valor]
        }),
        origem: this.fb.group({
          descricao: [registro.icms.origem.descricao],
          valor: [registro.icms.origem.valor]
        }),
        modBCICMS: [registro.icms.modBCICMS],
        modBCST: [registro.icms.modBCST]
      }),
      ipi: [registro.ipi],
      pis: [registro.pis],
      pisST: [registro.pisST],
      cofins: [registro.cofins],
      cofinsST: [registro.cofinsST]
    });
  }

  changeCst(event) {
    const registro = this.cstsICMS.find(element => element.valor === event.value);
    this.form.get('icms').get('cstICMS').patchValue(registro);
  }

  changeOrigem(event) {
    const registro = this.origens.find(element => element.valor === event.value);
    this.form.get('icms').get('origem').patchValue(registro);
  }

  updateIcms(val: any) {
    this.form.get('icms').patchValue(val);
  }

  updateIpi(val: any) {
    this.form.get('ipi').patchValue(val);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
