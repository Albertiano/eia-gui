import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../node_modules/@angular/forms';
import { TributacaoService } from '../tributacao.service';
import { ErrorHandlerService } from '../../core/error-handler.service';

@Component({
  selector: 'eia-ipi',
  templateUrl: './ipi.component.html',
  styleUrls: ['./ipi.component.scss']
})
export class IpiComponent implements OnInit {

  @Input()
  ipi: any;
  @Output()
  valuesChange: EventEmitter<any>;

  form: FormGroup;

  csts: any;
  tpsCalc: any;

  constructor(
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private service: TributacaoService) {

      this.valuesChange = new EventEmitter();

      this.service.loadCstIPI().subscribe(data => { this.csts = data; }, erro => { this.errorHandler.handle(erro); });
      this.service.loadTpCalcIPI().subscribe(data => { this.tpsCalc = data; }, erro => { this.errorHandler.handle(erro); });
    }

    ngOnInit() {
      if (!this.ipi.tpCalcIPI) {
        this.ipi.tpCalcIPI = { descricao: '', valor: '00' };
      }
      this.buildForm();
      this.form.valueChanges.subscribe(val => {
        this.valuesChange.emit(val);
      });
    }

    buildForm() {
      const registro = this.ipi;
      this.form = this.fb.group({
        cEnq: [registro.cEnq],
        cSelo: [registro.cSelo],
        cnpjprod: [registro.cnpjprod],
        cstIPI: this.fb.group({
          descricao: [registro.cstIPI.descricao],
          valor: [registro.cstIPI.valor]
        }),
        pIPI: [registro.pIPI],
        qSelo: [registro.qSelo],
        qUnid: [registro.qUnid],
        tpCalcIPI: this.fb.group({
          descricao: [registro.tpCalcIPI.descricao],
          valor: [registro.tpCalcIPI.valor]
        }),
        vBCIPI: [registro.vBCIPI],
        vIPI: [registro.vIPI],
        vIpiBcICMS: [registro.vIpiBcICMS],
        vIpiBcICMSST: [registro.vIpiBcICMSST],
        vUnid: [registro.vUnid]
      });
    }

    changeCst(event) {
      const registro = this.csts.find(element => element.valor === event.value);
      this.form.get('cstIPI').patchValue(registro);
    }

    changeTpCalc(event) {
      const registro = this.csts.find(element => element.valor === event.value);
      this.form.get('tpCalcIPI').patchValue(registro);
    }

}
