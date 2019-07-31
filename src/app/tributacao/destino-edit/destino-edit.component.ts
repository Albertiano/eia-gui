import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { NumeroConversor } from '../../shared/util/numero';
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

  numeroConversor: NumeroConversor;
  decimalPipe: DecimalPipe;

  modICMS: any;
  modICMSST: any;

  icmsSimples: boolean = false;
  icmsNormal: boolean = false;
  icmsST: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DestinoEditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private service: TributacaoService
  ) {
      this.registro = registro;

      this.numeroConversor = new NumeroConversor();
      this.decimalPipe = new DecimalPipe('pt-BR');

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

      this.service.modICMS().subscribe(data => {
        this.modICMS = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });

      this.service.modICMSST().subscribe(data => {
        this.modICMSST = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });
  }

  ngOnInit() {
    if (!this.registro.icms.modBCICMS) {
      this.registro.icms.modBCICMS = { descricao: '', valor: '3' };
    }
    this.buildForm();
    this.displayIcms(this.form.get('icms').get('cstICMS').value.valor);
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
        modBCICMS: this.fb.group({
          descricao: [registro.icms.modBCICMS.descricao],
          valor: [registro.icms.modBCICMS.valor]
        }),
        modBCST: this.fb.group({
          descricao: [registro.icms.modBCST.descricao],
          valor: [registro.icms.modBCST.valor]
        }),
        pRedBCST: [registro.icms.pRedBCST],
        pMVAST: [registro.icms.pMVAST],
        vBCST: [registro.icms.vBCST],
        pICMSST: [registro.icms.pICMSST],
        vICMSST: [registro.icms.vICMSST],
        pCredSN: [registro.icms.pCredSN],
        vCredICMSSN: [registro.icms.vCredICMSSN],
        pRedBCICMS: [registro.icms.pRedBCICMS],
        vBCICMS: [registro.icms.vBCICMS],
        pICMS: [registro.icms.pICMS],
        vICMS: [registro.icms.vICMS]
      }),
      ipi: [registro.ipi],
      pis: [registro.pis],
      pisST: [registro.pisST],
      cofins: [registro.cofins],
      cofinsST: [registro.cofinsST]
    });
  }

  displayIcms(cst: any) {
    switch (cst) {
      case '101':
        this.icmsSimples = true;
        this.icmsNormal = false;
        this.icmsST = false;
        break;
      case '102':
      case '103':
      case '300':
      case '400':
        this.icmsSimples = false;
        this.icmsNormal = false;
        this.icmsST = false;
        break;
      case '201':
        this.icmsSimples = true;
        this.icmsNormal = false;
        this.icmsST = true;
        break;
      case '202':
      case '203':
        this.icmsSimples = false;
        this.icmsNormal = false;
        this.icmsST = true;
        break;
      case '500':
        this.icmsSimples = false;
        this.icmsNormal = false;
        this.icmsST = false;
        break;
      case '900':
        this.icmsSimples = true;
        this.icmsNormal = true;
        this.icmsST = true;
        break;
      default:
        this.icmsSimples = false;
        this.icmsNormal = false;
        this.icmsST = false;
        break;
    }
  }

  changeCst(event) {
    const registro = this.cstsICMS.find(element => element.valor === event.value);
    this.form.get('icms').get('cstICMS').patchValue(registro);
    this.displayIcms(registro.valor);
  }

  changeOrigem(event) {
    const registro = this.origens.find(element => element.valor === event.value);
    this.form.get('icms').get('origem').patchValue(registro);
  }

  changeModICMS(event) {
    const registro = this.modICMS.find(element => element.valor === event.value);
    this.form.get('icms').get('modBCICMS').patchValue(registro);
  }

  changeModICMSST(event) {
    const registro = this.modICMSST.find(element => element.valor === event.value);
    this.form.get('icms').get('modBCST').patchValue(registro);
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
