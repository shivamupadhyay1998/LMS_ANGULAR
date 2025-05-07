import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { Topicstatus } from '../model/topicstatus.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicstatusService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllTopicstatuss() {
    const topicstatusUrl = `${baseUrl}topicstatuses/scopes/${scopeId}`;
    return this.http.get<Topicstatus[]>(topicstatusUrl, this.options);
  }

  deleteTopicstatus(id: number) {
    const topicstatusUrl:string=`${baseUrl}topicstatuses/${id}`;
    return this.http.delete(topicstatusUrl,this.options);
  }

  createTopicstatus(topicstatus: Topicstatus) {
    const topicstatusUrl = `${baseUrl}topicstatuses/scopes/${scopeId}`;
    return this.http.post<Topicstatus>(topicstatusUrl, JSON.stringify(topicstatus), this.options);
  }

  findTopicstatus(id: number): Observable<any> {
    const topicstatusUrl: string = `${baseUrl}topicstatuses/${id}`;
    return this.http.get<Topicstatus>(topicstatusUrl, this.options);
  }

  updateTopicstatus(topicstatus: Topicstatus) {
    const id = topicstatus.id;
    const topicstatusUrl = `${baseUrl}topicstatuses/${id}`;
    return this.http.put(topicstatusUrl, topicstatus, this.options)
  }
}


