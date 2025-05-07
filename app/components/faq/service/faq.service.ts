import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FolderGetFileUrl, baseUrl, credentials, fAQFolderUrl, scopeId } from '../../../../environment/environment';
import { FAQ } from '../model/faq.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllFAQs() {
    const sectorUrl = `${baseUrl}faqs/scopes/${scopeId}`;
    return this.http.get<FAQ[]>(sectorUrl, this.options);
  }

  deleteFAQ(id: number) {
    const faqUrl: string = `${baseUrl}faqs/${id}`;
    return this.http.delete(faqUrl, this.options);
  }

  createFAQ(faq: FAQ) {
    const faqUrl = `${baseUrl}faqs/scopes/${scopeId}`;
    return this.http.post<FAQ>(faqUrl, JSON.stringify(faq), this.options);
  }

  public uploadfile(file: File) {
    let formParams = new FormData();
    formParams.append('file', file);
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.post(fAQFolderUrl, formParams, options)
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
    const documentUrl = fAQFolderUrl;
    const options = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
      }),
    };
    return this.http.get(documentUrl, options)
  }

  findFAQ(id: number): Observable<any> {
    const faqUrl: string = `${baseUrl}faqs/${id}`;
    return this.http.get<FAQ>(faqUrl, this.options);
  }

  updateFAQ(faq: FAQ) {
    const id = faq.id;
    const faqUrl = `${baseUrl}faqs/${id}`;
    return this.http.put(faqUrl, faq, this.options)

  }
}


