import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
      if (!this.registro.saldo) {
        this.registro.saldo = 0;
      }
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
      descricao: [registro.descricao, Validators.required],
      saldo: [registro.saldo, Validators.required]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
