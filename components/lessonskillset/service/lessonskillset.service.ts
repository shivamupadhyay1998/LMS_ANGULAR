import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { LessonSkillSet } from '../model/lessonskillset.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class lessionskillsetservice {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllLessionSkillSets() {
    const lessonskillsetUrl = `${baseUrl}lessonskillsets/scopes/${scopeId}`;
    return this.http.get<LessonSkillSet[]>(lessonskillsetUrl, this.options);
  }

  createLessonSkillSet(lessonskillset: LessonSkillSet) {
    const lessonskillsetUrl = `${baseUrl}lessonskillsets/scopes/${scopeId}`;
    return this.http.post<LessonSkillSet>(lessonskillsetUrl, JSON.stringify(lessonskillset), this.options);
  }

  findLessonSkillSet(id: number): Observable<any> {
    const lessonskillsetUrl: string = `${baseUrl}lessonskillsets/${id}`;
    return this.http.get<LessonSkillSet>(lessonskillsetUrl, this.options);
  }

  updateLessonSkillSet(lessonskillset: LessonSkillSet) {
    const id = lessonskillset.id;
    const sectorUrl = `${baseUrl}lessonskillsets/${id}`;
    return this.http.put(sectorUrl, lessonskillset, this.options)
  }
  
  deleteLessonSkillSet(id: number) {
    const lessonskillsetUrl:string=`${baseUrl}lessonskillsets/${id}`;
    return this.http.delete(lessonskillsetUrl,this.options);
  }
}
