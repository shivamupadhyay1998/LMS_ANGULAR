import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { YesNo } from '../../model/yesno.model';
import { YesnoService } from '../../service/yesno.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-yesno',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './yesno.component.html',
  styleUrl: './yesno.component.scss'
})
export class YesnoComponent {
  constructor(private yesNoService: YesnoService, private router: Router) { }

  //Variables
  yesNoData: any;
  isExtended: boolean = false;
  viewYesNo: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetYesNo: any = {};
  yesNo: YesNo = {
    id: 0,
    name: ''
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
    if (this.viewYesNo) { 
      this.yesNoData = '';
      this.viewYesNo = false;
      this.refreshYesNoList();
    }
  }

  // Function to call the create form 
  addYesNo() {
    this.isAddMode = true
  }
  //Function to create a YesNo
  createYesNo() {
    this.yesNoService.createYesNo(this.yesNo).subscribe({
      next: (data: YesNo) => {
        this.resetForm();
        alert('YesNo created successfully:');
        this.refreshYesNoList();
        this.isAddMode = false;
        this.viewYesNo = false;
        this.isEditMode = false;
      },
      error: (error: any) => {
        console.error('Error creating YesNo:', error);
      },
    });
  }

  //function to call the YesNo data in form fields to edit it
  editYesNo(id: any) {
    this.isEditMode = true;
    this.yesNo.id = id;
    if (this.yesNo.id) {
      this.yesNoService.findYesNo(this.yesNo.id).subscribe({
        next: (response: any) => {
          this.yesNo = response
          this.isLoaded = true
        },
        error: (error: any) => {
          console.error('Error fetching YesNo data:', error);
        }
      });
    }
  }

  //function to update the YesNo
  updateYesNo() { 
    var YesNo = {
      id: this.yesNo.id,
      name: this.yesNo.name,
    }
    this.yesNoService.updateYesNo(YesNo).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshYesNoList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of YesNo data
  viewDetail(id: number) {
    this.viewYesNo = true
    this.yesNoService.findYesNo(id).subscribe({
      next: (data: any) => {
        this.yesNoData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a YesNo
  deleteYesNo(id: number): void {
    this.yesNoService.deleteYesNo(id).subscribe({
      next: () => {
        this.refreshYesNoList();
        if (this.isDeleted) {
          alert(`YesNo with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting YesNo:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshYesNoList();
  }

  //Get all the yesNos
  private refreshYesNoList(): void {
    this.yesNoService.getAllYesNos().subscribe({
      next: (response: any) => {
        this.yesNoData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching yesNos:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.yesNo = {
      id: 0,
      name: '',
    }
  }

}



