import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PicklistService {
  email: string = 'test@liferay.com';
  password: string = '12345';
  credentials = btoa(`${this.email}:${this.password}`);
  options = {
    headers: new HttpHeaders({
      'Authorization': `Basic ${this.credentials}`
    })
  };

  constructor(private http: HttpClient) { }
  private pickListApiUrl = 'http://localhost:8080/o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/';

  getMembershipData(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}4121be34-556a-09c0-0ade-8b2b0a887f27`;
    return this.http.get<any>(picklistUrl, this.options);
  }
  getActiveData(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}f1a1cb37-65a0-3f0f-6ce9-d14fa8d1af92`;
    return this.http.get<any>(picklistUrl, this.options);
  }

  getLevelData(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}c1788977-0f01-56d2-d18d-c010096d52b7`;
    return this.http.get<any>(picklistUrl, this.options);
  }

  getDayData(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}9a219f21-f974-1ea6-4238-82c1adfc5cec`;
    return this.http.get<any>(picklistUrl, this.options);
  }

  getNoOfQuestionsPerLesson(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}eeb6c42c-8b08-ee34-6ffa-c8fdfd96fee6`;
    return this.http.get<any>(picklistUrl, this.options);
  }
  getTestTypeData(): Observable<any> {
    const picklistUrl = `${this.pickListApiUrl}57208a05-3c78-70a8-3cdf-e901761f59eb`;
    return this.http.get<any>(picklistUrl, this.options);
  }
}
