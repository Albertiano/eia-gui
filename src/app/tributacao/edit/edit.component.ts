import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

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
      id: [registro.id],
      active: [registro.active],
      createdAt: [registro.createdAt],
      empresa: [this.empresaService.getEmpresaAtiva()],
      nome: [registro.nome],
      descricao: [registro.descricao],
      destinos: [registro.destinos]
    });
  }

  updateDestinos(tributacao) {
    const control = this.form.controls.destinos;
    control.setValue(tributacao.destinos);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
