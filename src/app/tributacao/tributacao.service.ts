import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';
import { EmpresaService } from '../empresa/empresa.service';

@Injectable({
  providedIn: 'root'
})
export class TributacaoService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) {}

  loadRegistros (props): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc',
        filter: props.filter,
        empresa: this.empresaService.getEmpresaAtiva().id
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/tributacao`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/tributacao/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/tributacao`, registro);
  }

  novo (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/new`)
      .pipe(
        map(res => {
          res.empresa = this.empresaService.getEmpresaAtiva();
          return res;
        })
      );
  }

  loadOrigem (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/origem`)
      .pipe(
        map(res => res)
      );
  }

  loadCstICMS (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/cst-icms`)
      .pipe(
        map(res => res)
      );
  }

  modICMS (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/mod-icms`)
      .pipe(
        map(res => res)
      );
  }

  modICMSST (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/mod-icms-st`)
      .pipe(
        map(res => res)
      );
  }

  loadCstIPI (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/cst-ipi`)
      .pipe(
        map(res => res)
      );
  }

  loadTpCalcIPI (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/tributacao/tp-calc-ipi`)
      .pipe(
        map(res => res)
      );
  }

}
