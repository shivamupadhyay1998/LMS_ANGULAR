import { Component } from '@angular/core';
import { DatePipe,NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LearningPath } from '../model/learningpath.model';
import { LearningpathService } from '../service/learningpath.service';

@Component({
  selector: 'app-learningpath',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,DatePipe],
  templateUrl: './learningpath.component.html',
  styleUrl: './learningpath.component.scss'
})
export class LearningpathComponent {
  constructor(private learningPathService: LearningpathService, private router: Router) { }

  //Variables
  learningPathData: any;
  isExtended: boolean = false;
  viewLearningPath: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetLearningPath: any = {};
  learningPath: LearningPath = {
    learningMilestone: '',
    title: '',
    id: 0
  };

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
    if (this.viewLearningPath) { 
      this.learningPathData = '';
      this.viewLearningPath = false;
      this.refreshLearningPathList()
    }
  }

  // Function to call the create form 
  addLearningPath() {
    this.isAddMode = true
    console.log(this.isAddMode)
  }
  //Function to create a learningPath
  createLearningPath() {
    this.learningPathService.createLearningPath(this.learningPath).subscribe({
      next: (data: LearningPath) => {
        this.resetForm();
        alert('LearningPath created successfully:');
        this.refreshLearningPathList();
        this.isAddMode = false;
        this.viewLearningPath = false;
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error creating learningPath:', error);
      },
    });
  }

  //function to call the learningPath data in form fields to edit it
  editLearningPath(id: number) {
    this.isEditMode = true;
    this.learningPath.id = id;
    if (this.learningPath.id) {
      this.learningPathService.findLearningPath( this.learningPath.id).subscribe({
        next: (response: any) => {
          this.learningPath = response
          console.log(this.learningPath)
          this.isLoaded = true
        },
        error: (error) => {
          console.error('Error fetching learningPath data:', error);
        }
      });
    }
  }

  //function to update the learningPath
  updateLearningPath() { 
    var learningPath = {
      id: this.learningPath.id,
      learningMilestone: this.learningPath.learningMilestone,
      title: this.learningPath.title
    }
    this.learningPathService.updateLearningPath(learningPath).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshLearningPathList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of LearningPath data
  viewDetail(id: number) {
    this.viewLearningPath = true
    this.learningPathService.findLearningPath(id).subscribe({
      next: (data: any) => {
        this.learningPathData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a LearningPath
  deleteLearningPath(id: number): void {
    console.log(id)
    this.learningPathService.deleteLearningPath(id).subscribe({
      next: () => {
        this.refreshLearningPathList();
        if (this.isDeleted) {
          alert(`LearningPath with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting learningPath:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshLearningPathList();
  }

  //Get all the learningPaths
  private refreshLearningPathList(): void {
    this.learningPathService.getAllLearningPaths().subscribe({
      next: (response: any) => {
        this.learningPathData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching learningPaths:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.learningPath = {
      learningMilestone: '',
      title: '',
      id:0
    }
  }

}
