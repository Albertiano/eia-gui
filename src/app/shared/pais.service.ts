import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  constructor(private http: AuthHttp) { }

  loadRegistros (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/pais`)
      .pipe(
        map(res => res)
      );
  }
}
