import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { State } from '../model/state.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllStates() {
    const stateUrl = `${baseUrl}states/scopes/${scopeId}`;
    return this.http.get<State[]>(stateUrl, this.options);
  }

  createState(state: State) {
    const stateUrl = `${baseUrl}states/scopes/${scopeId}`;
    return this.http.post<State>(stateUrl, JSON.stringify(state), this.options);
  }

  findState(id: number): Observable<any> {
    const stateUrl: string = `${baseUrl}states/${id}`;
    return this.http.get<State>(stateUrl, this.options);
  }

  updateState(state: State) {
    const id = state.id;
    const sectorUrl = `${baseUrl}states/${id}`;
    return this.http.put(sectorUrl, state, this.options)
  }
  
  deleteState(id: number) {
    const stateUrl:string=`${baseUrl}states/${id}`;
    return this.http.delete(stateUrl,this.options);
  }
}
