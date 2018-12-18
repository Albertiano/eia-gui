import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';
import { EmpresaService } from '../empresa/empresa.service';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) {}

  totalPages (props): Observable<number> {
    const filtro = {
      q: props.filter,
      idEmpresa: this.empresaService.getEmpresaAtiva().id,
      ini: props.ini,
      fim: props.fim
    };

    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc'
      }
    });
    return this.http.post<any>(`${environment.apiUrl}/lancamento/pages`, filtro, { params: httpParams })
      .pipe(
        map(res => res - 1)
      );
  }

  loadRegistros (props): Observable<any[]> {
    const filtro = {
      q: props.filter,
      idEmpresa: this.empresaService.getEmpresaAtiva().id,
      ini: props.ini,
      fim: props.fim
    };

    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc'
      }
    });
    return this.http.post<any>(`${environment.apiUrl}/lancamento/filtro`, filtro, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  novo (): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        empresa: this.empresaService.getEmpresaAtiva().id
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/lancamento/novo`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  loadTpLancamento (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/lancamento/TpLancamento`)
      .pipe(
        map(res => res)
      );
  }

  loadTpPagamento (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/lancamento/TpPagamento`)
      .pipe(
        map(res => res)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/lancamento/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/lancamento`, registro);
  }

}
