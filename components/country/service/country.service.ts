import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { Country } from '../model/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllCountrys() {
    const countryUrl = `${baseUrl}countries/scopes/${scopeId}`;
    return this.http.get<Country[]>(countryUrl, this.options);
  }

  createCountry(country: Country) {
    const countryUrl = `${baseUrl}countries/scopes/${scopeId}`;
    return this.http.post<Country>(countryUrl, JSON.stringify(country), this.options);
  }

  findCountry(id: number): Observable<any> {
    const countryUrl: string = `${baseUrl}countries/${id}`;
    return this.http.get<Country>(countryUrl, this.options);
  }

  deleteCountry(id: number) {
    const countryUrl: string = `${baseUrl}countries/${id}`;
    return this.http.delete(countryUrl, this.options);
  }

  updateCountry(country: Country) {
    const id = country.id;
    const countryUrl = `${baseUrl}countries/${id}`;
    return this.http.put(countryUrl, country, this.options)
  }

}
