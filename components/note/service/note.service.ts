import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { credentials, baseUrl, scopeId } from '../../../../environment/environment';
import { Note } from '../model/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    })
  };
  constructor(private http: HttpClient) { }

  getAllNotes() {
    const noteUrl = `${baseUrl}notes/scopes/${scopeId}`;
    return this.http.get<Note[]>(noteUrl, this.options);
  }

  createNote(note: Note) {
    const noteUrl = `${baseUrl}notes/scopes/${scopeId}`;
    return this.http.post<Note>(noteUrl, JSON.stringify(note), this.options);
  }

  findNote(id: number): Observable<any> {
    const noteUrl: string = `${baseUrl}notes/${id}`;
    return this.http.get<Note>(noteUrl, this.options);
  }

  updateNote(note: Note) {
    console.log("hellon"+note.id);
    const id = note.id;
    const r_topicToNote_c_topicId = note.topic.id;
    const payload = {
      r_topicToNote_c_topicId,
      ...note,
      topic: {
        ...note.topic,
      },
    };

    const sectorUrl = `${baseUrl}notes/${id}`;
    return this.http.put(sectorUrl, payload, this.options)
  }
  
  deleteNote(id: number) {
    const noteUrl:string=`${baseUrl}notes/${id}`;
    return this.http.delete(noteUrl,this.options);
  }
}
