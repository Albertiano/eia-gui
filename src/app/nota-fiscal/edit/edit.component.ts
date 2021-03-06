import { Component, OnInit, Inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogConfig, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import * as moment from 'moment';

import { EmpresaService } from '../../empresa/empresa.service';
import { ContatoSelectComponent } from '../../contato/contato-select/contato-select.component';
import { ProdutoSelectComponent } from '../../produto/produto-select/produto-select.component';
import { NotaFiscalService } from '../nota-fiscal.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { NumeroConversor } from './../../shared/util/numero';
import { EditItemComponent } from '../edit-item/edit-item.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MunicipioService } from '../../shared/municipio.service';
import { ConfigPdvService } from 'src/app/config-pdv/config-pdv.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  FinNFe: any = [];
  TpNF: any = [];
  IdDest: any = [];
  IndFinal: any = [];
  IndPres: any = [];
  ModFrete: any = [];
  ufs: any;

  item: any = {};

  pLiq = 0.00;
  pBru = 0.00;
  qVol = 0.00;
  vBC = 0.00;
  vICMS = 0.00;
  vBCST = 0.00;
  vST = 0.00;
  vProd = 0.00;
  vFrete = 0.00;
  vSeg = 0.00;
  vDesc = 0.00;
  vIPI = 0.00;
  vPIS = 0.00;
  vCOFINS = 0.00;
  vOutro = 0.00;
  vNF = 0.00;
  vTotTrib = 0.00;
  vII = 0.00;

  @ViewChild('itemCodigo', {static: true})
  itemCodigo: ElementRef;
  @ViewChild('itemDesc', {static: true})
  itemDesc: ElementRef;
  @ViewChild('itemUn', {static: true})
  itemUn: ElementRef;
  @ViewChild('itemQuant', {static: true})
  itemQuant: ElementRef;
  @ViewChild('itemPreco', {static: true})
  itemPreco: ElementRef;
  @ViewChild('itemSubt', {static: true})
  itemSubt: ElementRef;

  @ViewChild('chaveNFRef', {static: true})
  chaveNFRef: ElementRef;

  @ViewChild('indPag', {static: true})
  indPag: ElementRef;
  @ViewChild('tPag', {static: true})
  tPag: ElementRef;
  @ViewChild('vPag', {static: true})
  vPag: ElementRef;

  formasPag: any = [];
  tiposPag: any = [];

  detPag: any = {};

  displayedColumns: string[] = ['descricao', 'cfop', 'quantidade', 'unidade', 'precoVenda', 'subtotal', 'actions'];
  dataSource: MatTableDataSource<any>;

  displayedColumnsNFRef: string[] = ['refNFe', 'actions'];
  dataSourceNFRef: MatTableDataSource<any>;

  displayedColumnsPag: string[] = ['indPag', 'tPag', 'vPag', 'actions'];
  dataSourcePag: MatTableDataSource<any>;

  numeroConversor: NumeroConversor;
  decimalPipe: DecimalPipe;

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private empresaService: EmpresaService,
    private service: NotaFiscalService,
    private municipioService: MunicipioService,
    private configPdvService: ConfigPdvService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro}
  ) {
    this.registro = registro;
    moment.locale('pt-br');

    this.numeroConversor = new NumeroConversor();
    this.decimalPipe = new DecimalPipe('pt-BR');

    if (this.registro.dhEmi) {
      const time = moment(this.registro.dhEmi, 'YYYY-MM-DD hh:mm:ss A Z');
      this.registro.dhEmi = time.format('DD/MM/YYYY HH:mm:ss');
    } else {
      this.registro.dhEmi = moment().format('DD/MM/YYYY HH:mm:ss');
    }
    if (this.registro.dhSaiEnt) {
      const time = moment(this.registro.dhSaiEnt, 'YYYY-MM-DD hh:mm:ss A Z');
      this.registro.dhSaiEnt = time.format('DD/MM/YYYY HH:mm:ss');
    } else {
      this.registro.dhSaiEnt = moment().format('DD/MM/YYYY HH:mm:ss');
    }

    if (!this.registro.finNFe) { this.registro.finNFe = { valor: '1' }; }
    if (!this.registro.tpNF) { this.registro.tpNF = { valor: '1' }; }
    if (!this.registro.idDest) { this.registro.idDest = { valor: '1' }; }
    if (!this.registro.indFinal) { this.registro.indFinal = { valor: '0' }; }
    if (!this.registro.indPres) { this.registro.indPres = { valor: '0' }; }
    if (!this.registro.tpImp) { this.registro.tpImp = { valor: '1' }; }
    if (!this.registro.nfref) { this.registro.nfref = []; }
    if (!this.registro.itens) { this.registro.itens = []; }
    if (!this.registro.total) { this.registro.total = {}; }
    if (!this.registro.dest) {
      this.registro.dest = {
        municipio: {},
        pais: {}
      };
    }
    if (!this.registro.transp) {
      this.registro.transp = {
        modFrete: { valor: '1' },
        transporta: {
          municipio: {},
          pais: {}
        },
        veicTransp: {}
      };
    }
    if (!this.registro.infAdic) { this.registro.infAdic = {}; }

    if (!this.registro.pag) { this.registro.pag = {detPag: []}; }

      this.municipioService.loadUFs().subscribe(data => {
        this.ufs = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });

      service.loadFinNFe().subscribe(data => this.FinNFe = data, erro => this.errorHandler.handle(erro));
      service.loadTpNF().subscribe(data => this.TpNF = data, erro => this.errorHandler.handle(erro));
      service.loadIdDest().subscribe(data => this.IdDest = data, erro => this.errorHandler.handle(erro));
      service.loadIndFinal().subscribe(data => this.IndFinal = data, erro => this.errorHandler.handle(erro));
      service.loadIndPres().subscribe(data => this.IndPres = data, erro => this.errorHandler.handle(erro));
      service.loadModFrete().subscribe(data => this.ModFrete = data, erro => this.errorHandler.handle(erro));
      service.loadIndPag().subscribe(data => this.formasPag = data, erro => this.errorHandler.handle(erro));
      service.loadTpPag().subscribe(data => this.tiposPag = data, erro => this.errorHandler.handle(erro));
  }

  ngOnInit() {
    this.buildForm();
    this.itemPreco.nativeElement.value = '0,0000';
    this.itemSubt.nativeElement.value = '0,00';

    this.dataSource = new MatTableDataSource(this.form.get('itens').value);
    this.dataSourceNFRef = new MatTableDataSource(this.form.get('nfref').value);
    this.dataSourcePag = new MatTableDataSource(this.form.controls.pag.get('detPag').value);
  }

  ngAfterViewInit() {
  }

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      id: [registro.id],
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      sitNfe: [registro.sitNfe],
      versao: ['4.00'],
      chave: [registro.chave],
      uf: [registro.uf],
      cNF: [registro.cNF],
      natOp: [registro.natOp],
      mod: [registro.mod],
      serie: [registro.serie],
      numero: [registro.numero],
      dhEmi: [registro.dhEmi],
      dhSaiEnt: [registro.dhSaiEnt],
      tpNF: this.fb.group({
        valor: [registro.tpNF.valor],
        desc: [registro.tpNF.descricao]
      }),
      idDest: this.fb.group({
        valor: [registro.idDest.valor],
        desc: [registro.idDest.descricao]
      }),
      munFG: [this.empresaService.getEmpresaAtiva().municipio.cMun],
      tpImp: this.fb.group({
        valor: [registro.tpImp.valor],
        desc: [registro.tpImp.descricao]
      }),
      tpEmis: ['1'],
      cDV: [registro.cDV],
      tpAmb: [registro.tpAmb],
      finNFe: this.fb.group({
        valor: [registro.finNFe.valor],
        desc: [registro.finNFe.descricao]
      }),
      indFinal: this.fb.group({
        valor: [registro.indFinal.valor],
        desc: [registro.indFinal.descricao]
      }),
      indPres: this.fb.group({
        valor: [registro.indPres.valor],
        desc: [registro.indPres.descricao]
      }),
      procEmi: ['0'],
      verProc: ['4.00'],
      dhCont: [registro.dhCont],
      xJust: [registro.xJust],
      nfref: this.fb.array(registro.nfref),
      emitente: [this.empresaService.getEmpresaAtiva()],
      pdv: [this.configPdvService.getPDV()],
      dest: this.buildContato(registro.dest),
      itens: this.fb.array(registro.itens),
      total: this.fb.group({
        vDesc: [registro.total.vDesc],
        vFrete: [registro.total.vFrete],
        vOutro: [registro.total.vOutro],
        vProd: [registro.total.vProd],
        vSeg: [registro.total.vSeg],
        vTotTrib: [registro.total.vTotTrib],
        vBC: [registro.total.vBC],
        vBCST: [registro.total.vBCST],
        vCOFINS: [registro.total.vCOFINS],
        vICMS: [registro.total.vICMS],
        vII: [registro.total.vII],
        vIPI: [registro.total.vIPI],
        vNF: [registro.total.vNF],
        vPIS: [registro.total.vPIS],
        vST: [registro.total.vST]
      }),
      transp: this.fb.group({
        modFrete: this.fb.group({
          valor: [registro.transp.modFrete.valor],
          desc: [registro.transp.modFrete.desc]
        }),
        transporta: this.buildContato(registro.transp.transporta),
        veicTransp: this.fb.group({
          placa: [registro.transp.veicTransp.placa],
          uf: [registro.transp.veicTransp.uf],
          rntc: [registro.transp.veicTransp.rntc]
        }),
      }),
      cobr: [registro.cobr],
      pag: this.fb.group({
        detPag: this.fb.array(registro.pag.detPag)
      }),
      infAdic: this.fb.group({
        infAdFisco: [registro.infAdic.infAdFisco],
        infCpl: [registro.infAdic.infCpl]
      })
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
      nome: [registro.nome],
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

  changeFinNFe(event) {
    this.form.get('finNFe').patchValue(this.FinNFe.find(element => element.valor === event.value));
  }
  changeTpNF(event) {
    this.form.get('tpNF').patchValue(this.TpNF.find(element => element.valor === event.value));
  }
  changeIdDest(event) {
    this.form.get('idDest').patchValue(this.IdDest.find(element => element.valor === event.value));
  }
  changeIndFinal(event) {
    this.form.get('indFinal').patchValue(this.IndFinal.find(element => element.valor === event.value));
  }
  changeIndPres(event) {
    this.form.get('indPres').patchValue(this.IndPres.find(element => element.valor === event.value));
  }
  changeModFrete(event) {
    this.form.get('transp').get('modFrete').patchValue(this.ModFrete.find(element => element.valor === event.value));
  }

  changeDest() {
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
          this.form.get('dest').patchValue(register);
        }
      }
    );
  }

  changeTransporta() {
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
          this.form.get('transp').get('transporta').patchValue(register);
        }
      }
    );
  }

  changeProduto() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '95%';
    dialogConfig.maxWidth = '99vw';
    const dialogRef = this.dialog.open(ProdutoSelectComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          this.item.produto = register;
          this.itemCodigo.nativeElement.value = register.codigo;
          this.itemDesc.nativeElement.value = register.descricao;
          this.itemUn.nativeElement.value = register.unidade.sigla;
          this.itemQuant.nativeElement.value = this.decimalPipe.transform(1, '1.0-4');
          this.itemPreco.nativeElement.value = this.decimalPipe.transform(register.precoVenda, '1.2-10');
          this.itemSubt.nativeElement.value = this.decimalPipe.transform(register.precoVenda, '1.2-2');
        }
      }
    );
  }

  updateItem() {
    const qtd = this.numeroConversor.parse(this.itemQuant.nativeElement.value);
    const preco = this.numeroConversor.parse(this.itemPreco.nativeElement.value);

    this.itemSubt.nativeElement.value = this.decimalPipe.transform(qtd * preco, '1.2-2');
  }

  addItem() {
    const qtd = this.numeroConversor.parse(this.itemQuant.nativeElement.value);
    const preco = this.numeroConversor.parse(this.itemPreco.nativeElement.value);

    const props = {
      idProd: this.item.produto.id,
      quant: qtd,
      vUn: preco,
      uf: this.form.get('dest').get('municipio').get('uf').value
    };

    this.service
      .getItem(props)
      .subscribe(
        register => {
          this.item = {};
          this.itemCodigo.nativeElement.value = '';
          this.itemDesc.nativeElement.value = '';
          this.itemUn.nativeElement.value = '';
          this.itemQuant.nativeElement.value = '0,00';
          this.itemPreco.nativeElement.value = '0,00';
          this.itemSubt.nativeElement.value = '0,00';

          const control = <FormArray>this.form.controls.itens;
          control.push(this.fb.group(register));
          this.dataSource.data = control.value;
          this.atualizaTotais();
        },
        erro => this.errorHandler.handle(erro)
      );
  }

  editItem(index) {
    const registro = this.form.get('itens').value[index];
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '90%';
    dialogConfig.width = '99%';
    dialogConfig.maxWidth = '99vw';
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(EditItemComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (register) => {
        if (register) {
          const control = <FormArray>this.form.controls.itens;
          control.controls[index].patchValue(register);
          this.dataSource.data = this.form.controls.itens.value;
          this.atualizaTotais();
        }
      }
    );
  }

  remove(index) {
    const registro = this.form.get('itens').value[index];
    registro.nome = registro.produto.descricao;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (reg) => {
        if (reg) {
          const control = <FormArray>this.form.controls.itens;
          control.removeAt(index);
          this.dataSource.data = this.form.controls.itens.value;
          this.atualizaTotais();
        }
      }
    );
  }

  atualizaTotais() {
    this.pLiq = 0.00;
    this.pBru = 0.00;
    this.qVol = 0.00;
    this.vBC = 0.00;
    this.vICMS = 0.00;
    this.vBCST = 0.00;
    this.vST = 0.00;
    this.vProd = 0.00;
    this.vFrete = 0.00;
    this.vSeg = 0.00;
    this.vDesc = 0.00;
    this.vIPI = 0.00;
    this.vPIS = 0.00;
    this.vCOFINS = 0.00;
    this.vOutro = 0.00;
    this.vNF = 0.00;

    const control = <FormArray>this.form.controls.itens;
    const itens = control.value;
    itens.forEach(i => {
      this.pLiq += i.pesoLiquido;
      this.pBru += i.pesoBruto;
      this.qVol += i.quantidade;
      this.vBC += i.detFiscal.icms.vBCICMS;
      this.vICMS += i.detFiscal.icms.vICMS;
      this.vBCST += i.detFiscal.icms.vBCST;
      this.vST += i.detFiscal.icms.vICMSST;
      this.vProd += i.subtotal;
      this.vFrete += i.vFrete;
      this.vSeg += i.vSeg;
      this.vDesc += i.vDesc;
      this.vIPI += i.detFiscal.ipi.vIPI;
      this.vPIS += i.detFiscal.pis.vPIS;
      this.vCOFINS += i.detFiscal.cofins.vCOFINS;
      this.vOutro += i.vOutro;
      this.vII += i.vII;
      this.vTotTrib += i.detFiscal.vTotTrib;
    });
    this.vNF = this.vProd - this.vDesc + this.vST + this.vFrete + this.vSeg + this.vOutro + this.vIPI;
    const total = {
      vDesc: this.vDesc,
      vFrete: this.vFrete,
      vOutro: this.vOutro,
      vProd: this.vProd,
      vSeg: this.vSeg,
      vTotTrib: this.vTotTrib,
      vBC: this.vBC,
      vBCST: this.vBCST,
      vCOFINS: this.vCOFINS,
      vICMS: this.vICMS,
      vII: this.vII,
      vIPI: this.vIPI,
      vNF: this.vNF,
      vPIS: this.vPIS,
      vST: this.vST
    };
    this.form.get('total').patchValue(total);

    const pag = {
      detPag: [{
          indPag: {
              valor: '0',
              descricao: 'A Vista'
          },
          tPag: {
              valor: '01',
              descricao: 'Dinheiro'
          },
          vPag: this.vNF,
          card: null
      }]
  };
   this.form.get('pag').patchValue(pag);
   const pagControl = <FormArray>this.form.controls.pag.get('detPag');
   this.dataSourcePag.data = pagControl.value;
  }

  addNFRef() {
    const nfRef = { refNFe: this.chaveNFRef.nativeElement.value };
    const control = <FormArray>this.form.controls.nfref;
    control.push(this.fb.group(nfRef));
    this.dataSourceNFRef.data = control.value;
  }

  removeNFRef(index) {
    const registro = this.form.get('nfref').value[index];
    registro.nome = registro.refNFe;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (reg) => {
        if (reg) {
          const control = <FormArray>this.form.controls.nfref;
          control.removeAt(index);
          this.dataSourceNFRef.data = this.form.controls.nfref.value;
        }
      }
    );
  }

  changeIndPag(event) {
    this.detPag.indPag = this.formasPag.find(element => element.valor === event.value);
  }

  changeTpPag(event) {
    this.detPag.tPag = this.tiposPag.find(element => element.valor === event.value);
  }

  addDetPag() {
    this.detPag.vPag = this.numeroConversor.parse(this.vPag.nativeElement.value);
    const control = <FormArray>this.form.controls.pag.get('detPag');
    control.push(this.fb.group(this.detPag));
    this.dataSourcePag.data = control.value;
  }

  removePag(index) {
    const registro = this.form.controls.pag.get('detPag').value[index];
    registro.nome = registro.tPag;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = { registro };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      (reg) => {
        if (reg) {
          const control = <FormArray>this.form.controls.pag.get('detPag');
          control.removeAt(index);
          this.dataSourcePag.data = control.value;
        }
      }
    );
  }

  save() {
    const dhEmi = moment(this.form.get('dhEmi').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('dhEmi').setValue(dhEmi);
    const dhSaiEnt = moment(this.form.get('dhSaiEnt').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('dhSaiEnt').setValue(dhSaiEnt);
    this.dialogRef.close(this.form.value);
  }

  close() {
    const dhEmi = moment(this.form.get('dhEmi').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('dhEmi').setValue(dhEmi);
    const dhSaiEnt = moment(this.form.get('dhSaiEnt').value, 'DD/MM/YYYY HH:mm:ss').utc();
    this.form.get('dhSaiEnt').setValue(dhSaiEnt);
    console.log(this.form.value);
    this.dialogRef.close();
  }

}

