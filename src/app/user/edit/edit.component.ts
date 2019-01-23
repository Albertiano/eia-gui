import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'eia-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {

  registro: any;
  form: FormGroup;

  roles: any;

  constructor(
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private authService: AuthService,
    private userService: UserService,
  ) {
      this.registro = registro;

      this.userService.loadRoles({
        pageIndex: 0,
        pageSize: 50,
        sortBy: 'name'
      }).subscribe(data => {
        this.roles = data;
      }, erro => {
        this.errorHandler.handle(erro);
      });

      if (!this.registro.roles) {
        this.userService.loadRegistros({
          pageIndex: 0,
          pageSize: 50,
          sortBy: 'email',
          filter: ''
        }).subscribe(data => {
          const temp = data.find(element => element.email === authService.jwtPayload.sub);
          this.registro.roles = temp.roles;
          this.setRoles();
        }, erro => {
          this.errorHandler.handle(erro);
        });
      }
  }

  ngOnInit() {
    this.buildForm();
  }

  ngAfterViewInit() {
    if (this.registro.roles) {
      this.setRoles();
    }
  }

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      active: [registro.active],
      createdAt: [registro.createdAt],
      email: [registro.email, [Validators.required, Validators.email]],
      id: [registro.id],
      lastName: [registro.lastName],
      name: [registro.name],
      password: [null],
      roles: this.fb.array([])
    });
  }

  setRoles() {
    const control = <FormArray>this.form.controls.roles;
    this.registro.roles.forEach(role => {
      control.push(this.fb.group({
        active: role.active,
        createdAt: role.createdAt,
        id: role.id,
        name: role.name,
        privileges: this.fb.array(role.privileges)
      }));
    });
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]) as FormArray;
  }

  save(senha) {
    const temp = this.form.value;
    if (senha === temp.password && senha !== '') {
      this.dialogRef.close(this.form.value);
    } else {
      this.snackBar.open('Verifique as senhas!', null, { duration: 3000, });
    }
  }

  close() {
    console.log(this.form.value);
    this.dialogRef.close();
  }

}
