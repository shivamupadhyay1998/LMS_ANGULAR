import { Injectable } from '@angular/core';
import { Designation } from '../model/designation.model';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllDesignation() {
    const designationUrl = `${baseUrl}designations/scopes/${scopeId}`;
    return this.http.get<Designation[]>(designationUrl, this.options);
  }

  createDesignation(designation: Designation) {
    const designationUrl = `${baseUrl}designations/scopes/${scopeId}`;
    return this.http.post<Designation>(designationUrl, JSON.stringify(designation), this.options);
  }

  findDesignation(id: number): Observable<any> {
    const designationUrl: string = `${baseUrl}designations/${id}`;
    return this.http.get<Designation>(designationUrl, this.options);
  }

  updateDesignation(state: Designation) {
    const id = state.id;
    const designationUrl = `${baseUrl}designations/${id}`;
    return this.http.put(designationUrl, state, this.options)
  }
  
  deleteDesignation(id: number) {
    const designationUrl:string=`${baseUrl}designations/${id}`;
    return this.http.delete(designationUrl,this.options);
  }
}
