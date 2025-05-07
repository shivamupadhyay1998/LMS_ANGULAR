import { DatePipe,NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentlevelService } from '../service/assessmentlevel.service';
import { AssessmentLevel } from '../model/assessmentlevel.model';


@Component({
  selector: 'app-assessmentlevel',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,DatePipe],
  templateUrl: './assessmentlevel.component.html',
  styleUrl: './assessmentlevel.component.scss'
})
export class AssessmentlevelComponent {
  constructor(private assessmentlevelService: AssessmentlevelService, private router: Router) { }

  //Variables
  assessmentlevelData: any;
  isExtended: boolean = false;
  viewAssessmentLevel: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetAssessmentLevel: any = {};
  assessmentlevel: AssessmentLevel = {
    sequenceNo: '',
    title: '',
    description: '',
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
    if (this.viewAssessmentLevel) { 
      this.assessmentlevelData = '';
      this.viewAssessmentLevel = false;
      this.refreshAssessmentLevelList()
    }
  }

  // Function to call the create form 
  addAssessmentLevel() {
    this.isAddMode = true
    console.log(this.isAddMode)
  }
  //Function to create a assessmentlevel
  createAssessmentLevel() {
    this.assessmentlevelService.createAssessmentLevel(this.assessmentlevel).subscribe({
      next: (data: AssessmentLevel) => {
        this.resetForm();
        alert('AssessmentLevel created successfully:');
        this.refreshAssessmentLevelList();
        this.isAddMode = false;
        this.viewAssessmentLevel = false;
        this.isEditMode = false;
      },
      error: (error: any) => {
        console.error('Error creating assessmentlevel:', error);
      },
    });
  }

  //function to call the assessmentlevel data in form fields to edit it
  editAssessmentLevel(id: number) {
    this.isEditMode = true;
    this.assessmentlevel.id = id;
    if ( this.assessmentlevel.id ) {
      this.assessmentlevelService.findAssessmentLevel( this.assessmentlevel.id ).subscribe({
        next: (response: any) => {
          this.assessmentlevel = response
          console.log(this.assessmentlevel)
          this.isLoaded = true
        },
        error: (error: any) => {
          console.error('Error fetching assessmentlevel data:', error);
        }
      });
    }
  }

  //function to update the assessmentlevel
  updateAssessmentLevel() { 
    var assessmentlevel = {
      id: this.assessmentlevel.id,
      sequenceNo: this.assessmentlevel.sequenceNo,
      title: this.assessmentlevel.title,
      description: this.assessmentlevel.description
    }
    this.assessmentlevelService.updateAssessmentLevel(assessmentlevel).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshAssessmentLevelList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of AssessmentLevel data
  viewDetail(id: number) {
    this.viewAssessmentLevel = true
    this.assessmentlevelService.findAssessmentLevel(id).subscribe({
      next: (data: any) => {
        this.assessmentlevelData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a AssessmentLevel
  deleteAssessmentLevel(id: number): void {
    console.log(id)
    this.assessmentlevelService.deleteAssessmentLevel(id).subscribe({
      next: () => {
        this.refreshAssessmentLevelList();
        if (this.isDeleted) {
          alert(`AssessmentLevel with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting assessmentlevel:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshAssessmentLevelList();
  }

  //Get all the assessmentlevels
  private refreshAssessmentLevelList(): void {
    this.assessmentlevelService.getAllAssessmentLevels().subscribe({
      next: (response: any) => {
        this.assessmentlevelData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching assessmentlevels:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.assessmentlevel = {
      sequenceNo: '',
      title: '',
      description: '',
      id:0,
    }
  }

}
