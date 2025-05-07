import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from '../model/lesson.model';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { Topic } from '../../topic/model/topic.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllLessons() {
    const lessonUrl = `${baseUrl}lessons/scopes/${scopeId}`;
    return this.http.get<Lesson[]>(lessonUrl, this.options);
  }

  getAllTopicsByLessonId(id:any) {
    const courseUrl = `${baseUrl}lessons/${id}/lessonToTopic`;
    return this.http.get<Topic[]>(courseUrl, this.options);
    
  }


  createLesson(lesson: Lesson) {
    const sectorUrl = `${baseUrl}lessons/scopes/${scopeId}`;
    return this.http.post<Lesson>(sectorUrl, JSON.stringify(lesson), this.options);
  }

  deleteLesson(id: number) {
    const lessonUrl:string=`${baseUrl}lessons/${id}`;
    return this.http.delete(lessonUrl,this.options);
  }

  findLesson(id: number): Observable<any> {
    const lessonUrl: string = `${baseUrl}lessons/${id}`;
    return this.http.get<Lesson>(lessonUrl, this.options);
  }

  updateLesson(lesson: Lesson) {
    const id= lesson.id;
    const lessonUrl = `${baseUrl}lessons/${id}`;
    return this.http.put(lessonUrl, lesson,this.options)

  }

  private topicByLessonId: string = '';

  setTopicByLessonId(id: string) {
    this.topicByLessonId = id;
  }

  getTopicByLessonId(): string {
    return this.topicByLessonId;
  }
}
