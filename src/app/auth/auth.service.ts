import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {
    this.carregarToken();
  }

  login(usuario: string, senha: string): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', 'Bearer ' + null);

    const credencial: any = {};
    credencial.email = usuario;
    credencial.password = senha;

    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credencial,
        { headers, withCredentials: false })
      .toPromise()
      .then(response => {
        const token = response.token;
        this.armazenarToken(token);
        const refreshToken = response.refreshToken;
        localStorage.setItem('refreshToken', refreshToken);
      })
      .catch(response => {
        if (response.status === 401) {
          return Promise.reject('Usuário ou senha inválida!');
        }

        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Authorization', 'Bearer ' + refreshToken);

    return this.http.get<any>(`${environment.apiUrl}/auth/token`, { headers, withCredentials: true })
      .toPromise()
      .then(response => {
        const token = response.token;
        this.armazenarToken(token);

        console.log('Novo access token criado!');

        return Promise.resolve(null);
      })
      .catch(response => {
        console.error('Erro ao renovar token.', response);
        return Promise.resolve(null);
      });
  }

  limparAccessToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.jwtPayload = null;
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');

    return !token || this.jwtHelper.isTokenExpired(token);
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  temQualquerPermissao(roles) {
    for (const role of roles) {
      if (this.temPermissao(role)) {
        return true;
      }
    }

    return false;
  }

  private armazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.armazenarToken(token);
    }
  }

}
