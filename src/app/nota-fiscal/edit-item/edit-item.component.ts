import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import { NumeroConversor } from '../../shared/util/numero';

@Component({
  selector: 'eia-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  registro: any;
  form: FormGroup;

  numeroConversor: NumeroConversor;
  decimalPipe: DecimalPipe;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA) {registro}
  ) {
    this.registro = registro;
    this.numeroConversor = new NumeroConversor();
    this.decimalPipe = new DecimalPipe('pt-BR');
  }

  ngOnInit() {
    this.buildForm();
    this.form.get('quantidade').setValue(this.decimalPipe.transform(this.form.get('quantidade').value, '1.0-10'));
    this.form.get('precoVenda').setValue(this.decimalPipe.transform(this.form.get('precoVenda').value, '1.2-2'));
    this.form.get('subtotal').setValue(this.decimalPipe.transform(this.form.get('subtotal').value, '1.2-2'));
  }

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      nItem: [registro.nItem],
      detFiscal: this.buildDetFiscalForm(registro.detFiscal),
      produto: this.buildProdutoForm(registro.produto),
      precoVenda: [registro.precoVenda],
      quantidade: [registro.quantidade],
      subtotal: [registro.subtotal],
      vDesc: [registro.vDesc],
      vFrete: [registro.vFrete],
      vOutro: [registro.vOutro],
      vSeg: [registro.vSeg]
    });
  }

  buildDetFiscalForm(registro): FormGroup {
    return this.fb.group({
      cEan: [registro.cEan],
      cEanTrib: [registro.cEanTrib],
      cfop: [registro.cfop],
      cofins: [registro.cofins],
      cofinsST: [registro.cofinsST],
      extipi: [registro.extipi],
      genero: [registro.genero],
      icms: [registro.icms],
      ipi: [registro.ipi],
      pis: [registro.pis],
      pisST: [registro.pisST],
      qTrib: [registro.qTrib],
      utrib: [registro.utrib],
      vuntrib: [registro.vuntrib],
    });
  }

  buildProdutoForm(registro): FormGroup {
     return this.fb.group({
      id: [registro.id],
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [registro.empresa],
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

  updateIcms(val: any) {
    this.form.get('detFiscal').get('icms').patchValue(val);
  }

  updateIpi(val: any) {
    this.form.get('detFiscal').get('ipi').patchValue(val);
  }

  updateItem() {
    const qtd = this.numeroConversor.parse(this.form.get('quantidade').value);
    const preco = this.numeroConversor.parse(this.form.get('precoVenda').value);
    const subtotal = qtd * preco;
    this.form.get('subtotal').setValue(this.decimalPipe.transform(subtotal, '1.2-2'));
  }

  save() {
    this.form.get('quantidade').setValue(this.numeroConversor.parse(this.form.get('quantidade').value));
    this.form.get('precoVenda').setValue(this.numeroConversor.parse(this.form.get('precoVenda').value));
    this.form.get('subtotal').setValue(this.numeroConversor.parse(this.form.get('subtotal').value));
    this.form.get('detFiscal').get('qTrib').setValue(this.numeroConversor.parse(this.form.get('quantidade').value));
    this.form.get('detFiscal').get('vuntrib').setValue(this.numeroConversor.parse(this.form.get('precoVenda').value));
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
