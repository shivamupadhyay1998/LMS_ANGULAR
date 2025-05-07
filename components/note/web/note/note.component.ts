import { Component } from '@angular/core';
import { Topic } from '../../../topic/model/topic.model';
import { TopicService } from '../../../topic/service/topic.service';
import { Note } from '../../model/note.model';
import { NoteService } from '../../service/note.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent {
  constructor(private noteService: NoteService, private topicService : TopicService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewNote: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  noteData: any;
  topicData: any;

  note: Note ={
    id: 0,
    note: '',
    topic: {
      id: 0,
      topicName: ''
    }
  }

   //to get the action menu
   expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //redirect to home page
  redirectToHomePage() {
    if (this.isAddMode || this.isEditMode) {
      this.resetForm(); 
      this.isAddMode = false;
      this.isEditMode = false;
    }
    if (this.viewNote) { 
      this.noteData = '';
      this.viewNote = false;
    }
  }

  //To call the create note form
  addNote() { this.isAddMode = true }

  //Creating note
  createNote() {
    const r_topicToNote_c_topicId = this.note.topic.id;
    const payload = {
      r_topicToNote_c_topicId,
      ...this.note,
      topic: {
        ...this.note.topic,
      },
    };
    this.noteService.createNote(payload).subscribe({
      next: (data: Note) => {
        this.refreshNoteList();
        alert('Note created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewNote = false;

      },
      error: (error) => {
        console.error('Error creating notes:', error);
      },
    });
  }

  //Editing note fuctions
  editNote(id: number) {
    this.isEditMode = true;
    this.noteService.findNote(id).subscribe({
      next: (data: any) => {
        this.note.id=data.id;
        this.note.note = data.note;
        if (data.r_topicToNote_c_topicId) {
          this.note.topic.id = data.r_topicToNote_c_topicId;
          this.topicService.findTopic(this.note.topic.id).subscribe({
            next: (topicData: any) => {
              this.note.topic.topicName = topicData.topicName;
            },
            error: (error: any) => {
              console.error('Error fetching topic data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching note data:', error);
      }
    });
  }
  updateNote() {
    var note = {
      id: this.note.id,
      note: this.note.note,
      topic: {
        id: this.note.topic.id,
        topicName: this.note.topic.topicName,
      }
    }
    this.noteService.updateNote(note).subscribe({
      next: (updatedData: any) => {
        this.refreshNoteList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of note function
  viewDetail(id: number) {
    this.viewNote= true
    this.noteService.findNote(id).subscribe({
      next: (data: any) => {
        this.noteData = data;
        this.topicService.findTopic(this.noteData.r_topicToNote_c_topicId).subscribe({
          next: (data: any) => {
            this.topicData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting note data
  deleteNote(id: number): void {
    this.noteService.deleteNote(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Note deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting note:', error);
      }
    });
  }

  //Get all sector list
  refreshNoteList() {
    //get all sectors data for list view
    this.noteService.getAllNotes().subscribe({
      next: (response: any) => {
        this.noteData = response.items;
        this.noteData.forEach((note: Note) => {
          if (note.r_topicToNote_c_topicId != 0) {
            const r_topicToNote_c_topicId = note.r_topicToNote_c_topicId;
            this.topicService.findTopic(r_topicToNote_c_topicId).subscribe({
              next: (domainData: any) => {
                note.topic = domainData;
              },
              error: (error: any) => {
                console.error('Error fetching note data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.note = {
      id: 0,
      note: '',
      topic: {
        id: 0,
        topicName: '',
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshNoteList();

    //get all domains data in sectors for the dropdown
    this.topicService.getAllTopic().subscribe({
      next: (response: any) => {
        this.topicData = response.items;
        this.topicData.forEach((topic: Topic) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching countries:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }
}

