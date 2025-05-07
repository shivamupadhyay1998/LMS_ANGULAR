import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course} from '../model/course.model';
import { FolderGetFileUrl, baseUrl, courseFolderUrl, credentials, scopeId } from '../../../../environment/environment';
import { Lesson } from '../../lesson/model/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllCourses() {
    const courseUrl = `${baseUrl}courses/scopes/${scopeId}`;
    return this.http.get<Course[]>(courseUrl, this.options);
  }

  getAllLessonsByCourseId(id:any) {
    const courseUrl = `${baseUrl}courses/${id}/courseToLesson`;
    return this.http.get<Lesson[]>(courseUrl, this.options);
    
  }

  deleteCourse(id: number) {
    const courseUrl: string = `${baseUrl}courses/${id}`;
    return this.http.delete(courseUrl, this.options);
  }

  createCourse(course: Course) {
    const courseUrl = `${baseUrl}courses/scopes/${scopeId}`;
    return this.http.post<Course>(courseUrl, JSON.stringify(course), this.options);
  }

  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file);
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.post(courseFolderUrl, formParams, options)
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
    const documentUrl = courseFolderUrl;

    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.get(documentUrl, options)
  }

  findCourse(id: number): Observable<any> {
    const courseUrl: string = `${baseUrl}courses/${id}`;
    return this.http.get<Course>(courseUrl, this.options);
  }

  updateCourse(course: Course) {
    const id = course.id;
    const sectorUrl = `${baseUrl}courses/${id}`;
    return this.http.put(sectorUrl, course, this.options)

  }

  private lessonByCourseid:number = 0;

  setlessonByCourseId(id:number) {
    this.lessonByCourseid = id;
  }

  getlessonByCourseId(): number {
    return this.lessonByCourseid;
  }



}


