import { Injectable } from '@angular/core';
import { AuthHttp } from '../auth/auth-http';
import { Observable } from 'rxjs';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { EmpresaService } from '../empresa/empresa.service';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NfeService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) {}

  statusServico (): Observable<any> {
    const httpParams = new HttpParams({
      fromObject: {
        empresaID: this.empresaService.getEmpresaAtiva().id
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/nfe/status`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  danfe (registro): Observable<any> {
    const httpParams = new HttpParams({
      fromObject: {
        idNota: registro.id
      }
    });
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get<any>(`${environment.apiUrl}/nfe/danfe`, {
      params: httpParams,
      headers: headers,
      responseType: 'blob'
    });
  }

  enviar (nf): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/nfe/enviar`, nf);
  }

  consultaRecibo (retorno): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/nfe/consultaRecibo`, retorno);
  }

  cancelar (registro, motivo): Observable<any> {
    const dto = {
      idNota: registro.id,
      motivo: motivo,
      empresaID: this.empresaService.getEmpresaAtiva().id
    };
    return this.http.post<any>(`${environment.apiUrl}/nfe/cancelar`, dto);
  }

  consultar (registro): Observable<any> {
    const dto = {
      idNota: registro.id,
      empresaID: this.empresaService.getEmpresaAtiva().id
    };
    return this.http.post<any>(`${environment.apiUrl}/nfe/consultar`, dto);
  }

}
