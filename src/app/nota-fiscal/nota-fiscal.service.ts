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
export class NotaFiscalService {

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
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/nota-fiscal/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/nota-fiscal`, registro);
  }

  duplicar (id): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/duplicar/${id}`)
      .pipe(
        map(res => res)
      );
  }

  exportar2 (nfs: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/zip');

    let ids = [];

    nfs.forEach(element => {
      ids.push(element.id)
    });

    return this.http.post<any>(`${environment.apiUrl}/nota-fiscal/exportar`, ids, {
      headers: headers,
      responseType: 'blob'
    });
  }

  exportar (registro): Observable<any> {
    const httpParams = new HttpParams({
      fromObject: {
        idNota: registro.id
      }
    });
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/zip');

    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/exportar`, {
      params: httpParams,
      headers: headers,
      responseType: 'blob'
    });
  }

  loadFinNFe (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/FinNFe`)
      .pipe(
        map(res => res)
      );
  }

  loadTpNF (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/TpNF`)
      .pipe(
        map(res => res)
      );
  }

  loadIdDest (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/IdDest`)
      .pipe(
        map(res => res)
      );
  }

  loadIndFinal (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/IndFinal`)
      .pipe(
        map(res => res)
      );
  }

  loadIndPres (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/IndPres`)
      .pipe(
        map(res => res)
      );
  }

  loadModFrete (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/ModFrete`)
      .pipe(
        map(res => res)
      );
  }

  loadIndPag (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/IndPag`)
      .pipe(
        map(res => res)
      );
  }

  loadTpPag (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/TpPag`)
      .pipe(
        map(res => res)
      );
  }

  getItem (props): Observable<any> {
    const httpParams = new HttpParams({
      fromObject: {
        idProd: props.idProd,
        quant: props.quant,
        vUn: props.vUn,
        uf: props.uf
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/nota-fiscal/item`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

}
