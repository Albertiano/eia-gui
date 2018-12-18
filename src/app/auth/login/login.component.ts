import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorHandlerService } from '../../core/error-handler.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'eia-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  display: boolean;
  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.limparAccessToken();
    this.display = false;
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      senha: [null, Validators.required]
    });
  }

  login() {
    const valueSubmit = Object.assign({}, this.form.value);
    this.auth.login(valueSubmit.email, valueSubmit.senha)
      .then(() => {
        this.form.get('senha').setValue('');
        this.display = true;
        this.router.navigate(['/login/select']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

}
