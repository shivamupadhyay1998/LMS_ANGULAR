import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sector} from '../model/sector.model';
import { Observable } from 'rxjs/internal/Observable';
import { baseUrl, credentials, scopeId } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllSectors() {
    const sectorUrl = `${baseUrl}sectors/scopes/${scopeId}`;
    return this.http.get<Sector[]>(sectorUrl, this.options);
  }

  deleteSector(id: number) {
    const sectorUrl:string=`${baseUrl}sectors/${id}`;
    return this.http.delete(sectorUrl,this.options);
  }

  createSector(sector: Sector) {
    const sectorUrl = `${baseUrl}sectors/scopes/${scopeId}`;
    return this.http.post<Sector>(sectorUrl, JSON.stringify(sector), this.options);
  }

  findSector(id: number): Observable<any> {
    const sectorUrl: string = `${baseUrl}sectors/${id}`;
    return this.http.get<Sector>(sectorUrl, this.options);
  }

  updateSector(sector: Sector) {
    const id = sector.id;
    const sectorUrl = `${baseUrl}sectors/${id}`;
    return this.http.put(sectorUrl, sector, this.options)
  }
}


