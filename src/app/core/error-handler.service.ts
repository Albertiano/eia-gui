import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { NotAuthenticatedError } from '../auth/auth-http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private router: Router,
    public snackBar: MatSnackBar
  ) { }

  handle(errorResponse: any) {
    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;

    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);

    } else if (errorResponse instanceof HttpErrorResponse
        && errorResponse.status >= 400 && errorResponse.status <= 499) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      if (errorResponse.status === 401) {
        msg = 'Verifique o usuário e senha';
      }

      try {
        msg = errorResponse.error.errors[0].defaultMessage;
      } catch (e) { }

      console.error('Ocorreu um erro', errorResponse);

    } else if (errorResponse.status === 0) {
      msg = 'Sem Resposta do Servidor.';
      console.error('Ocorreu um erro', errorResponse);
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente: ' + errorResponse;
      console.error('Ocorreu um erro', errorResponse);
    }
      this.snackBar.open(msg, null, { duration: 5000, });
  }

}
