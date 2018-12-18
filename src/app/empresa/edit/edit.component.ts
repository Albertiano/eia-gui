import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

import { ErrorHandlerService } from '../../core/error-handler.service';
import { MunicipioService } from '../../shared/municipio.service';
import { PaisService } from '../../shared/pais.service';
import { EmpresaService } from '../empresa.service';
import { UserService } from '../../user/user.service';
import { AuthService } from '../../auth/auth.service';

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
  crts: any;

  users: any;
  userSelected: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditComponent>,
    @Inject(MAT_DIALOG_DATA) {registro},
    private errorHandler: ErrorHandlerService,
    private authService: AuthService,
    private userService: UserService,
    private empresaService: EmpresaService,
    private paisService: PaisService,
    private municipioService: MunicipioService
  ) {
      this.registro = registro;

      if (!this.registro.crt) {
        this.registro.crt = { value: '1' };
      }

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

      if (!this.registro.users) {
        this.userService.loadRegistros({
          pageIndex: 0,
          pageSize: 50,
          sortBy: 'email',
          filter: ''
        }).subscribe(data => {
          this.users = data;
          const temp = this.users.find(element => element.email === authService.jwtPayload.sub);
          this.registro.users = [temp];
          this.setUsers();
        }, erro => {
          this.errorHandler.handle(erro);
        });
      } else {
        this.userService.loadRegistros({
          pageIndex: 0,
          pageSize: 50,
          sortBy: 'email',
          filter: ''
        }).subscribe(data => {
          this.users = data;
        }, erro => {
          this.errorHandler.handle(erro);
        });
      }

      this.empresaService.loadCRTs().subscribe(data => {
        this.crts = data;
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
    if (this.registro.users) {
      this.setUsers();
    }
  }

  buildForm() {
    const registro = this.registro;
    this.form = this.fb.group({
      active: [registro.active],
      bairro: [registro.bairro],
      cep: [registro.cep],
      complemento: [registro.complemento],
      createdAt: [registro.createdAt],
      crt: this.fb.group({
        desc: [registro.crt.desc],
        value: [registro.crt.value]
      }),
      email: [registro.email],
      fantasia: [registro.fantasia],
      fone: [registro.fone],
      id: [registro.id],
      ie: [registro.ie],
      iest: [registro.iest],
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
      pais: this.fb.group({
        active: [registro.pais.active],
        cPais: [registro.pais.cPais],
        createdAt: [registro.pais.createdAt],
        id: [registro.pais.id],
        updatedAt: [registro.pais.updatedAt],
        xPais: [registro.pais.xPais]
      }),
      tpDoc: [registro.tpDoc],
      updatedAt: [registro.updatedAt],
      users: this.fb.array([])
    });
  }

  getControls(frmGrp: FormGroup, key: string) {
    return (<FormArray>frmGrp.controls[key]) as FormArray;
  }

  setUsers() {
    const control = <FormArray>this.form.controls.users;
    this.registro.users.forEach(user => {
      control.push(this.fb.group({
        active: user.active,
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        lastName: user.lastName,
        name: user.name,
        password: user.password,
        roles: this.fb.array(user.roles)
      }));
    });
  }

  changeCRT(event) {
    const registro = this.crts.find(element => element.value === event.value);
    this.form.get('crt').patchValue(registro);
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

  changeUser(event) {
    this.userSelected = event.value;
  }

  addUser() {
    const control = <FormArray>this.form.controls.users;
    control.push(this.fb.group({
      active: this.userSelected.active,
      createdAt: this.userSelected.createdAt,
      email: {value: this.userSelected.email, disabled: true},
      id: this.userSelected.id,
      lastName: this.userSelected.lastName,
      name: this.userSelected.name,
      password: this.userSelected.password,
      roles: this.fb.array(this.userSelected.roles)
    }));
  }

  removeUser(index) {
    const control = <FormArray>this.form.controls.users;
    control.removeAt(index);
  }

  save() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
