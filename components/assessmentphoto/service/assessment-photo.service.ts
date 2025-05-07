import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId, assessmentPhotoFolderUrl, FolderGetFileUrl } from '../../../../environment/environment';
import { AssessmentPhoto } from '../model/assessment.model';

@Injectable({
  providedIn: 'root'
})
export class AssessmentPhotoService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllAssessmentPhotos() {
    const assessmentPhotoUrl = `${baseUrl}assessmentphotos/scopes/${scopeId}`;
    return this.http.get<AssessmentPhoto[]>(assessmentPhotoUrl, this.options);
  }

  deleteAssessmentPhoto(id: number) {
    const assessmentPhotoUrl: string = `${baseUrl}assessmentphotos/${id}`;
    return this.http.delete(assessmentPhotoUrl, this.options);
  }

  createAssessmentPhoto(assessmentPhoto: AssessmentPhoto) {
    const assessmentPhotoUrl = `${baseUrl}assessmentphotos/scopes/${scopeId}`;
    return this.http.post<AssessmentPhoto>(assessmentPhotoUrl, JSON.stringify(assessmentPhoto), this.options);
  }

  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file);
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.post(assessmentPhotoFolderUrl, formParams, options)
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
    const documentUrl = assessmentPhotoFolderUrl;
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.get(documentUrl, options)
  }

  findAssessmentPhoto(id: number): Observable<any> {
    const assessmentPhotoUrl: string = `${baseUrl}assessmentphotos/${id}`;
    return this.http.get<AssessmentPhoto>(assessmentPhotoUrl, this.options);
  }

  updateAssessmentPhoto(assessmentPhoto: AssessmentPhoto) {
    const id = assessmentPhoto.id;
    const assessmentPhotoUrl = `${baseUrl}assessmentphotos/${id}`;
    return this.http.put(assessmentPhotoUrl, assessmentPhoto, this.options)

  }
}



