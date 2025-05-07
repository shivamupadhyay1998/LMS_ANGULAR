import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';
import { Vocabulary } from '../model/vocabulary.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VocabularyService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllVocabularys() {
    const vocabularyUrl = `${baseUrl}vocabularies/scopes/${scopeId}`;
    return this.http.get<Vocabulary[]>(vocabularyUrl, this.options);
  }

  deleteVocabulary(id: number) {
    const vocabularyUrl:string=`${baseUrl}vocabularies/${id}`;
    return this.http.delete(vocabularyUrl,this.options);
  }

  createVocabulary(vocabulary: Vocabulary) {
    const vocabularyUrl = `${baseUrl}vocabularies/scopes/${scopeId}`;
    const r_domainToVocabulary_c_domainId = vocabulary.domain.id;
    const payload = {
      r_domainToVocabulary_c_domainId,
      ...vocabulary,
      domain: {
        ...vocabulary.domain,
      },
    };
    return this.http.post<Vocabulary>(vocabularyUrl, JSON.stringify(payload), this.options);
  }

  findVocabulary(id: number): Observable<any> {
    const vocabularyUrl: string = `${baseUrl}vocabularies/${id}`;
    return this.http.get<Vocabulary>(vocabularyUrl, this.options);
  }

  updateVocabulary(vocabulary: Vocabulary) {
    const id = vocabulary.id;
    const vocabularyUrl = `${baseUrl}vocabularies/${id}`;
    const r_domainToVocabulary_c_domainId = vocabulary.domain.id
    const payload = {
      r_domainToVocabulary_c_domainId,
      ...vocabulary,
      domain: {
        ...vocabulary.domain,
      },
    };
    return this.http.put(vocabularyUrl, payload, this.options)
  }
}



