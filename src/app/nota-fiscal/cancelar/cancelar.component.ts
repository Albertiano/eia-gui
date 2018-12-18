import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'eia-cancelar',
  templateUrl: './cancelar.component.html',
  styleUrls: ['./cancelar.component.scss']
})
export class CancelarComponent implements OnInit {

  registro: any;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CancelarComponent>,
    @Inject(MAT_DIALOG_DATA) {registro}
  ) {
    this.registro = registro;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      notaFiscal: [registro],
      motivo: ['', Validators.compose([ Validators.required, Validators.minLength(15) ])]
    });
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
