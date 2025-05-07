import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { Assessment } from '../model/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllAssessments() {
    const assessmentUrl = `${baseUrl}assessments/scopes/${scopeId}`;
    return this.http.get<Assessment[]>(assessmentUrl, this.options);
  }

 


  createAssessment(assessment: Assessment) {
    const sectorUrl = `${baseUrl}assessments/scopes/${scopeId}`;
    return this.http.post<Assessment>(sectorUrl, JSON.stringify(assessment), this.options);
  }

  deleteAssessment(id: number) {
    const assessmentUrl:string=`${baseUrl}assessments/${id}`;
    return this.http.delete(assessmentUrl,this.options);
  }

  findAssessment(id: number): Observable<any> {
    const assessmentUrl: string = `${baseUrl}assessments/${id}`;
    return this.http.get<Assessment>(assessmentUrl, this.options);
  }

  updateAssessment(assessment: Assessment) {
    const id= assessment.id;
    const assessmentUrl = `${baseUrl}assessments/${id}`;
    return this.http.put(assessmentUrl, assessment,this.options)

  }

 
}
