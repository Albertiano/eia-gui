import { ConfiguracaoService } from './../configuracao.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UploadService } from '../../shared/upload.service';
import { ErrorHandlerService } from '../../core/error-handler.service';
import { ComponentPageTitle } from '../../shared/page-title';
import { MatSnackBar } from '@angular/material';
import { EmpresaService } from '../../empresa/empresa.service';
import { NfeService } from '../../nota-fiscal/nfe.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  loading = false;
  certificadoFile: any;

  registro: any;

  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    public _componentPageTitle: ComponentPageTitle,
    private empresaService: EmpresaService,
    private uploadService: UploadService,
    private service: ConfiguracaoService,
    public snackBar: MatSnackBar,
    public nfeService: NfeService,
    private errorHandler: ErrorHandlerService) {
      this.registro = {};
      this.service.loadRegistro().subscribe((config) => {
        if (config) {
          this.registro = config;
          this.createForm();
        }
      });
  }

  ngOnInit() {
    this._componentPageTitle.title = 'Configurações';
  }

  createForm() {
    this.form = this.fb.group({
      active: [this.registro.active],
      certificadoFile: [this.registro.certificadoFile],
      certificadoSenha: [this.registro.certificadoSenha],
      createdAt: [this.registro.createdAt],
      csc: [this.registro.csc],
      id: [this.registro.id],
      idCsc: [this.registro.idCsc],
      logoFile: [this.registro.logoFile],
      numeroNFCe: [this.registro.numeroNFCe],
      numeroNFe: [this.registro.numeroNFe, Validators.required],
      serieNFCe: [this.registro.serieNFCe],
      serieNFe: [this.registro.serieNFe, Validators.required],
      updatedAt: [this.registro.updatedAt],
      empresa: [this.empresaService.getEmpresaAtiva()]
    });
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('certificadoFile').setValue(file.name);
      this.certificadoFile = file;
    }
  }

  private prepareSave(): any {
    const input = new FormData();
    input.append('file', this.certificadoFile);
    return input;
  }

  onSubmit() {
    const formModel = this.prepareSave();
    this.loading = true;
    this.uploadService.upload(formModel).subscribe(res => {
      this.loading = false;
      this.save();
    }, erro => {
      console.log(erro);
      this.errorHandler.handle(erro);
    });
  }

  clearFile() {
    this.form.get('file').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  changeFile() {
    this.fileInput.nativeElement.click();
  }

  save() {
    this.service.save(this.form.value).subscribe((config) => {
      this.registro = config;
      this.snackBar.open('Registro Salvo com Sucesso', null, { duration: 5000, });
    }, erro => {
      this.errorHandler.handle(erro);
    });
  }

  statusServico() {
    this.snackBar.open('Consultando o Status de Serviços NF-e', null, { duration: 13000, });
    this.nfeService.statusServico().subscribe((res) => {
      this.snackBar.open(res.cstat + ' - ' + res.xmotivo, null, { duration: 5000, });
    }, erro => {
      this.errorHandler.handle(erro);
    });
  }
}
