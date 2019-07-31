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
  modICMS: any;
  modICMSST: any;

  icmsSimples: boolean = false;
  icmsNormal: boolean = false;
  icmsST: boolean = false;

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
      if (!this.icms.modBCICMS) {
        this.icms.modBCICMS = { descricao: '', valor: '3' };
      }
      this.buildForm();
      this.form.valueChanges.subscribe(val => {
        this.valuesChange.emit(val);
      });
      this.displayIcms(this.form.get('cstICMS').value.valor);
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
        vICMSST: [registro.vICMSST],
        pCredSN: [registro.pCredSN],
        vCredICMSSN: [registro.vCredICMSSN],
        pRedBCICMS: [registro.pRedBCICMS],
        vBCICMS: [registro.vBCICMS],
        pICMS: [registro.pICMS],
        vICMS: [registro.vICMS]
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
      this.form.get('cstICMS').patchValue(registro);
      this.displayIcms(registro.valor);
    }

    changeOrigem(event) {
      const registro = this.origens.find(element => element.valor === event.value);
      this.form.get('origem').patchValue(registro);
    }

    changeModICMS(event) {
      const registro = this.modICMS.find(element => element.valor === event.value);
      this.form.get('modBCICMS').patchValue(registro);
    }

    changeModICMSST(event) {
      const registro = this.modICMSST.find(element => element.valor === event.value);
      this.form.get('modBCST').patchValue(registro);
    }


    updateValues() {
      const vBCST = this.numeroConversor.parse(this.form.get('vBCST').value);
      this.form.get('vBCST').setValue(this.decimalPipe.transform(vBCST, '1.2-2'));
    }

}
