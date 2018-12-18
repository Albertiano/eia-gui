import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private empresaAtiva: any;

  constructor(
    private router: Router,
    private http: AuthHttp) { }

  setEmpresaAtiva (empresa) {
    this.empresaAtiva = empresa;
  }

  getEmpresaAtiva () {
    if (this.empresaAtiva) {
      return this.empresaAtiva;
    } else {
      this.router.navigate(['/login/select']);
    }
    return this.empresaAtiva;
  }

  loadRegistros (props): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc',
        filter: props.filter
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/empresa`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }

  loadCRTs (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/empresa/crts`)
      .pipe(
        map(res => res)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/empresa/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/empresa`, registro);
  }
}
