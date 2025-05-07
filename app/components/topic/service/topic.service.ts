import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic} from '../model/topic.model';
import { FolderGetFileUrl, baseUrl, credentials, scopeId, topicFolderUrl } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllTopic() {
    const topicUrl = `${baseUrl}topics/scopes/${scopeId}`;
    return this.http.get<Topic[]>(topicUrl, this.options);
  }

  createTopic(topic: Topic) {
    const topicUrl = `${baseUrl}topics/scopes/${scopeId}`;
    return this.http.post<Topic>(topicUrl, JSON.stringify(topic), this.options);
  }

  deleteTopic(id: number) {
    const topicUrl:string=`${baseUrl}topics/${id}`;
    return this.http.delete(topicUrl,this.options);
  }
  
  findTopic(id: number): Observable<any> {
    const topicUrl: string = `${baseUrl}topics/${id}`;
    return this.http.get<Topic>(topicUrl, this.options);
  }

  updateTopic(topic: Topic) {
    const id = topic.id;
    const topicUrl = `${baseUrl}topics/${id}`;
    return this.http.put(topicUrl, topic, this.options)

  }

  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file);
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.post(topicFolderUrl, formParams, options)
  }

  public getUploadedfile(id: any) {
    const documentUrl = `${FolderGetFileUrl}/${id}`
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.get(documentUrl, options)
  }

  public getDocumentfile() {
    const documentUrl = topicFolderUrl;
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.get(documentUrl, options)
  }

}

