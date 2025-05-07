import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { AssessmentLevel } from '../model/assessmentlevel.model';
@Injectable({
  providedIn: 'root'
})
export class AssessmentlevelService {
 

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllAssessmentLevels() {
    const assessmentlevelUrl = `${baseUrl}assessmentlevels/scopes/${scopeId}`;
    return this.http.get<AssessmentLevel[]>(assessmentlevelUrl, this.options);
  }

  createAssessmentLevel(assessmentlevel: AssessmentLevel) {
    const assessmentlevelUrl = `${baseUrl}assessmentlevels/scopes/${scopeId}`;
    return this.http.post<AssessmentLevel>(assessmentlevelUrl, JSON.stringify(assessmentlevel), this.options);
  }

  findAssessmentLevel(id: number): Observable<any> {
    const assessmentlevelUrl: string = `${baseUrl}assessmentlevels/${id}`;
    return this.http.get<AssessmentLevel>(assessmentlevelUrl, this.options);
  }

  deleteAssessmentLevel(id: number) {
    const assessmentlevelUrl: string = `${baseUrl}assessmentlevels/${id}`;
    return this.http.delete(assessmentlevelUrl, this.options);
  }

  updateAssessmentLevel(assessmentlevel: AssessmentLevel) {
    const id = assessmentlevel.id;
    const assessmentlevelUrl = `${baseUrl}assessmentlevels/${id}`;
    return this.http.put(assessmentlevelUrl, assessmentlevel, this.options)
  }

}
