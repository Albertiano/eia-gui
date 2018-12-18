import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { ErrorHandlerService } from '../../core/error-handler.service';
import { EmpresaService } from '../../empresa/empresa.service';
import { MunicipioService } from '../../shared/municipio.service';
import { PaisService } from '../../shared/pais.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  paises: any;
  ufs: any;
  municipios: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private empresaService: EmpresaService,
    private paisService: PaisService,
    private municipioService: MunicipioService
  ) {
      this.registro = registro;

      if (!this.registro.pais) {
        this.registro.pais = {};
      }

      this.paisService.loadRegistros().subscribe(data => {
        this.paises = data;
        if (!this.registro.pais.id) {
          this.changePais({value: 1058});
        }
      }, erro => {
        this.errorHandler.handle(erro);
      });

      this.municipioService.loadUFs().subscribe(data => {
        this.ufs = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });

      if (this.registro.municipio) {
        this.municipioService.loadRegistros(this.registro.municipio.uf).subscribe(data => {
          this.municipios = data;
        }, erro => {
          this.errorHandler.handle(erro);
        });
      } else {
        this.registro.municipio = {};
        this.municipioService.loadRegistros('PB').subscribe(data => {
          this.municipios = data;
          this.changeMunicipio({value: 2501104});
        }, erro => {
          this.errorHandler.handle(erro);
        });
      }
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {
  }

  buildForm() {
    const registro = this.registro;

    this.form = this.fb.group({
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

  changePais(event) {
    const registro = this.paises.find(element => element.cPais === event.value);
    this.form.get('pais').patchValue(registro);
  }

  changeUF(event) {
    this.municipioService.loadRegistros(event.value).subscribe(data => {
      this.municipios = data;
      this.form.get('municipio').patchValue(this.municipios[0]);
    }, erro => {
      this.errorHandler.handle(erro);
    });
  }

  changeMunicipio(event) {
    const registro = this.municipios.find(element => element.cMun === event.value);
    this.form.get('municipio').patchValue(registro);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    console.log(this.form.value);
    this.dialogRef.close();
  }

}
