import { Injectable } from '@angular/core';
import { Currency } from '../model/currency.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllCurrencies() {
    const currencyUrl = `${baseUrl}currencies/scopes/${scopeId}`;
    return this.http.get<Currency[]>(currencyUrl, this.options);
  }

  createCurrency(currency: Currency) {
    const currencyUrl = `${baseUrl}currencies/scopes/${scopeId}`;
    return this.http.post<Currency>(currencyUrl, JSON.stringify(currency), this.options);
  }

  findCurrency(id: number): Observable<any> {
    const currencyUrl: string = `${baseUrl}currencies/${id}`;
    return this.http.get<Currency>(currencyUrl, this.options);
  }

  updateCurrency(currency: Currency) {
    const id = currency.id;
    const currencyUrl = `${baseUrl}currencys/${id}`;
    return this.http.put(currencyUrl, currency, this.options)
  }
  
  deleteCurrency(id: number) {
    const currencyUrl:string=`${baseUrl}currencies/${id}`;
    return this.http.delete(currencyUrl,this.options);
  }
}
