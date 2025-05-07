import { DatePipe,NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssessmentType } from './model/assessmenttype.model';
import { AssessmenttypeService } from './service/assessmenttype.service';


@Component({
  selector: 'app-assessmenttype',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule,DatePipe],
  templateUrl: './assessmenttype.component.html',
  styleUrl: './assessmenttype.component.scss'
})
export class AssessmenttypeComponent {
  constructor(private assessmenttypeService: AssessmenttypeService, private router: Router) { }

  //Variables
  assessmenttypeData: any;
  isExtended: boolean = false;
  viewAssessmentType: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetAssessmentType: any = {};
  assessmenttype: AssessmentType = {
    typeName: '',
    id: 0
  };

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  // Function to call the create form 
  addAssessmentType() {
    this.isAddMode = true
    console.log(this.isAddMode)
  }
  //Function to create a assessmenttype
  createAssessmentType() {
    this.assessmenttypeService.createAssessmentType(this.assessmenttype).subscribe({
      next: (data: AssessmentType) => {
        this.resetForm();
        alert('AssessmentType created successfully:');
        this.refreshAssessmentTypeList();
        this.isAddMode = false;
        this.viewAssessmentType = false;
        this.isEditMode = false;
      },
      error: (error: any) => {
        console.error('Error creating assessmenttype:', error);
      },
    });
  }

  //function to call the assessmenttype data in form fields to edit it
  editAssessmentType(id: number) {
    this.isEditMode = true;
    this.assessmenttype.id = id;
    if (this.assessmenttype.id) {
      this.assessmenttypeService.findAssessmentType(this.assessmenttype.id).subscribe({
        next: (response: any) => {
          this.assessmenttype = response
          console.log(this.assessmenttype)
          this.isLoaded = true
        },
        error: (error: any) => {
          console.error('Error fetching assessmenttype data:', error);
        }
      });
    }
  }

  //function to update the assessmenttype
  updateAssessmentType() { 
    var assessmenttype = {
      id: this.assessmenttype.id,
      typeName: this.assessmenttype.typeName,
      
    }
    this.assessmenttypeService.updateAssessmentType(assessmenttype).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshAssessmentTypeList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of AssessmentType data
  viewDetail(id: number) {
    this.viewAssessmentType = true
    this.assessmenttypeService.findAssessmentType(id).subscribe({
      next: (data: any) => {
        this.assessmenttypeData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a AssessmentType
  deleteAssessmentType(id: number): void {
    console.log(id)
    this.assessmenttypeService.deleteAssessmentType(id).subscribe({
      next: () => {
        this.refreshAssessmentTypeList();
        if (this.isDeleted) {
          alert(`AssessmentType with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting assessmenttype:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshAssessmentTypeList();
  }

  //Get all the assessmenttypes
  private refreshAssessmentTypeList(): void {
    this.assessmenttypeService.getAllAssessmentTypes().subscribe({
      next: (response: any) => {
        this.assessmenttypeData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching assessmenttypes:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.assessmenttype = {
      typeName: '',
      id:0,
      
    }
  }

}
