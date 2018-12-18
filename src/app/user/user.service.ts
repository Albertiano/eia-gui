import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: AuthHttp) { }

  loadRegistros (props): Observable<any[]> {
    const httpParams = new HttpParams({
      fromObject: {
        page: props.pageIndex,
        size: props.pageSize,
        sort: props.sortBy + ',asc',
        filter: props.filter
      }
    });
    return this.http.get<any>(`${environment.apiUrl}/user`, { params: httpParams })
      .pipe(
        map(res => res.content)
      );
  }

  remove (id: number): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/user/${id}`);
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user`, registro);
  }
}
