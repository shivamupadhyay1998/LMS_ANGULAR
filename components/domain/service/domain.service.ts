import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Domain} from '../model/domain.model';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DomainService {
 

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllDomains() {
    const domainUrl = `${baseUrl}domains/scopes/${scopeId}`;
    return this.http.get<Domain[]>(domainUrl, this.options);
  }

  createDomain(domain: Domain) {
    const domainUrl = `${baseUrl}domains/scopes/${scopeId}`;
    return this.http.post<Domain>(domainUrl, JSON.stringify(domain), this.options);
  }

  findDomain(id: number): Observable<any> {
    const domainUrl: string = `${baseUrl}domains/${id}`;
    return this.http.get<Domain>(domainUrl, this.options);
  }

  deleteDomain(id: number) {
    const domainUrl: string = `${baseUrl}domains/${id}`;
    return this.http.delete(domainUrl, this.options);
  }

  updateDomain(domain: Domain) {
    const id = domain.id;
    const domainUrl = `${baseUrl}domains/${id}`;
    return this.http.put(domainUrl, domain, this.options)
  }

}
