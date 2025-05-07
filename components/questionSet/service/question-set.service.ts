import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { QuestionSet } from '../model/questionSet.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionSetService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllQuestionSets() {
    const questionSetUrl = `${baseUrl}questionsets/scopes/${scopeId}`;
    return this.http.get<QuestionSet[]>(questionSetUrl, this.options);
  }

  deleteQuestionSet(id: number) {
    const questionSetUrl:string=`${baseUrl}questionsets/${id}`;
    return this.http.delete(questionSetUrl,this.options);
  }

  createQuestionSet(questionSet: QuestionSet) {
    const questionSetUrl = `${baseUrl}questionsets/scopes/${scopeId}`;
    return this.http.post<QuestionSet>(questionSetUrl, JSON.stringify(questionSet), this.options);
  }

  findQuestionSet(id: number): Observable<any> {
    const questionSetUrl: string = `${baseUrl}questionsets/${id}`;
    return this.http.get<QuestionSet>(questionSetUrl, this.options);
  }

  updateQuestionSet(questionSet: QuestionSet) {
    const id = questionSet.id;
    const questionSetUrl = `${baseUrl}questionsets/${id}`;
    return this.http.put(questionSetUrl, questionSet, this.options)
  }


}


