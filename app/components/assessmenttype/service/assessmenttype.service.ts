import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssessmentType} from '../model/assessmenttype.model';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class AssessmenttypeService {
 

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllAssessmentTypes() {
    const assessmenttypeUrl = `${baseUrl}assessmenttypes/scopes/${scopeId}`;
    return this.http.get<AssessmentType[]>(assessmenttypeUrl, this.options);
  }

  createAssessmentType(assessmenttype: AssessmentType) {
    const assessmenttypeUrl = `${baseUrl}assessmenttypes/scopes/${scopeId}`;
    return this.http.post<AssessmentType>(assessmenttypeUrl, JSON.stringify(assessmenttype), this.options);
  }

  findAssessmentType(id: number): Observable<any> {
    const assessmenttypeUrl: string = `${baseUrl}assessmenttypes/${id}`;
    return this.http.get<AssessmentType>(assessmenttypeUrl, this.options);
  }

  deleteAssessmentType(id: number) {
    const assessmenttypeUrl: string = `${baseUrl}assessmenttypes/${id}`;
    return this.http.delete(assessmenttypeUrl, this.options);
  }

  updateAssessmentType(assessmenttype: AssessmentType) {
    const id = assessmenttype.id;
    const assessmenttypeUrl = `${baseUrl}assessmenttypes/${id}`;
    return this.http.put(assessmenttypeUrl, assessmenttype, this.options)
  }

}
