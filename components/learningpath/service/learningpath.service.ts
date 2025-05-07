import { Injectable } from '@angular/core';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LearningPath } from '../model/learningpath.model';



@Injectable({
  providedIn: 'root'
})
export class LearningpathService {
 

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllLearningPaths() {
    const learningPathUrl = `${baseUrl}learningpaths/scopes/${scopeId}`;
    return this.http.get<LearningPath[]>(learningPathUrl, this.options);
  }

  createLearningPath(learningPath: LearningPath) {
    const learningPathUrl = `${baseUrl}learningpaths/scopes/${scopeId}`;
    return this.http.post<LearningPath>(learningPathUrl, JSON.stringify(learningPath), this.options);
  }

  findLearningPath(id: number): Observable<any> {
    const learningPathUrl: string = `${baseUrl}learningpaths/${id}`;
    return this.http.get<LearningPath>(learningPathUrl, this.options);
  }

  deleteLearningPath(id: number) {
    const learningPathUrl: string = `${baseUrl}learningpaths/${id}`;
    return this.http.delete(learningPathUrl, this.options);
  }

  updateLearningPath(learningPath: LearningPath) {
    const id = learningPath.id;
    const learningPathUrl = `${baseUrl}learningpaths/${id}`;
    return this.http.put(learningPathUrl, learningPath, this.options)
  }

}
