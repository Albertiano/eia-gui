import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

import { EmpresaService } from '../../empresa/empresa.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro}
  ) {
      this.registro = registro;
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
      isExterno: [registro.isExterno],
      serieNFe: [registro.serieNFe],
      numeroNFe: [registro.numeroNFe],
      serieNFCe: [registro.serieNFCe],
      numeroNFCe: [registro.numeroNFCe]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
