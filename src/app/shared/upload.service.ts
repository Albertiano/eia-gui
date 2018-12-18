import { Injectable } from '@angular/core';
import { AuthHttp } from '../auth/auth-http';
import { Observable } from 'rxjs';

import { EmpresaService } from '../empresa/empresa.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private http: AuthHttp,
    private empresaService: EmpresaService) { }

  upload (formModel: FormData): Observable<string> {
    formModel.append('path', this.empresaService.getEmpresaAtiva().id);
    return this.http.post<string>(`${environment.apiUrl}/upload`, formModel);
  }
}
