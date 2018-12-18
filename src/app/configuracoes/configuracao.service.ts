import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AuthHttp } from '../auth/auth-http';
import { EmpresaService } from '../empresa/empresa.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) {}

  loadRegistro (): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/configuracao/empresa=${this.empresaService.getEmpresaAtiva().id}`)
      .pipe(
        map(res => res)
      );
  }

  save (registro): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/configuracao`, registro);
  }

}
