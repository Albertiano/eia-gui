import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';

@Injectable({
  providedIn: 'root'
})
export class MunicipioService {

  constructor(private http: AuthHttp) { }

  loadUFs (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/municipio/ufs`)
      .pipe(
        map(res => res)
      );
  }

  loadRegistros (uf): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        uf: uf
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/municipio`, { params: httpParams })
      .pipe(
        map(res => res)
      );
  }
}
