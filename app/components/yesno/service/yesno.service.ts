import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { YesNo } from '../model/yesno.model';

@Injectable({
  providedIn: 'root'
})
export class YesnoService {


  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllYesNos() {
    const yesNoUrl = `${baseUrl}yesnos/scopes/${scopeId}`;
    return this.http.get<YesNo[]>(yesNoUrl, this.options);
  }

  createYesNo(yesNo: YesNo) {
    const yesNoUrl = `${baseUrl}yesnos/scopes/${scopeId}`;
    return this.http.post<YesNo>(yesNoUrl, JSON.stringify(yesNo), this.options);
  }

  findYesNo(id:number): Observable<any> {
    const yesNoUrl: string = `${baseUrl}yesnos/${id}`;
    return this.http.get<YesNo>(yesNoUrl, this.options);
  }

  deleteYesNo(id: number) {
    const yesNoUrl: string = `${baseUrl}yesnos/${id}`;
    return this.http.delete(yesNoUrl, this.options);
  }

  updateYesNo(yesNo: YesNo) {
    const id = yesNo.id;
    const yesNoUrl = `${baseUrl}yesnos/${id}`;
    return this.http.put(yesNoUrl, yesNo, this.options)
  }

}
