import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { Skill } from '../model/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllSkills() {
    const skillUrl = `${baseUrl}skills/scopes/${scopeId}`;
    return this.http.get<Skill[]>(skillUrl, this.options);
  }

  createSkill(skill: Skill) {
    const skillUrl = `${baseUrl}skills/scopes/${scopeId}`;
    return this.http.post<Skill>(skillUrl, JSON.stringify(skill), this.options);
  }

  findSkill(id: number): Observable<any> {
    const skillUrl: string = `${baseUrl}skills/${id}`;
    return this.http.get<Skill>(skillUrl, this.options);
  }

  deleteSkill(id: number) {
    const skillUrl: string = `${baseUrl}skills/${id}`;
    return this.http.delete(skillUrl, this.options);
  }

  updateSkill(skill: Skill) {
    const id = skill.id;
    const skillUrl = `${baseUrl}skills/${id}`;
    return this.http.put(skillUrl, skill, this.options)
  }

}
