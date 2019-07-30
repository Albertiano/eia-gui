import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../node_modules/@angular/forms';
import { DecimalPipe } from '@angular/common';

import { NumeroConversor } from '../../shared/util/numero';
import { TributacaoService } from '../tributacao.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'eia-icms',
  templateUrl: './icms.component.html',
  styleUrls: ['./icms.component.scss']
})
export class IcmsComponent implements OnInit {

  @Input()
  icms: any;
  @Output()
  valuesChange: EventEmitter<any>;

  form: FormGroup;

  numeroConversor: NumeroConversor;
  decimalPipe: DecimalPipe;

  cstsICMS: any;
  origens: any;
  modICMSST: any;

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private service: TributacaoService) {

      this.valuesChange = new EventEmitter();

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

      this.service.modICMSST().subscribe(data => {
        this.modICMSST = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });
    }

    ngOnInit() {
      if (!this.icms.modBCICMS) {
        this.icms.modBCICMS = { descricao: '', valor: '3' };
      }
      this.buildForm();
      this.form.valueChanges.subscribe(val => {
        this.valuesChange.emit(val);
      });
    }

    buildForm() {
      const registro = this.icms;
      this.form = this.fb.group({
        cstICMS: this.fb.group({
          descricao: [registro.cstICMS.descricao],
          valor: [registro.cstICMS.valor]
        }),
        origem: this.fb.group({
          descricao: [registro.origem.descricao],
          valor: [registro.origem.valor]
        }),
        modBCICMS: this.fb.group({
          descricao: [registro.modBCICMS.descricao],
          valor: [registro.modBCICMS.valor]
        }),
        modBCST: this.fb.group({
          descricao: [registro.modBCST.descricao],
          valor: [registro.modBCST.valor]
        }),
        pRedBCST: [registro.pRedBCST],
        pMVAST: [registro.pMVAST],
        vBCST: [registro.vBCST],
        pICMSST: [registro.pICMSST],
        vICMSST: [registro.vICMSST]
      });
    }

    changeCst(event) {
      const registro = this.cstsICMS.find(element => element.valor === event.value);
      this.form.get('cstICMS').patchValue(registro);
    }

    changeOrigem(event) {
      const registro = this.origens.find(element => element.valor === event.value);
      this.form.get('origem').patchValue(registro);
    }

    changeModICMSST(event) {
      const registro = this.modICMSST.find(element => element.valor === event.value);
      this.form.get('modBCST').patchValue(registro);
    }

    updateValues() {
      console.log(this.form.get('vBCST').value);
      const vBCST = this.numeroConversor.parse(this.form.get('vBCST').value);
      this.form.get('vBCST').setValue(this.decimalPipe.transform(vBCST, '1.2-2'));
    }

}
