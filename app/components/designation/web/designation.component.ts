import { Component } from '@angular/core';
import { DomainService } from '../../domain/service/domain.service';
import { DesignationService } from '../service/designation.service';
import { Designation } from '../model/designation.model';
import { DomainInCourse } from '../../course/model/course.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-designation',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './designation.component.html',
  styleUrl: './designation.component.scss'
})
export class DesignationComponent {
  constructor(private designationService: DesignationService, private domainService : DomainService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewDesignation: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  designationData: any;
  domainData: any;

  designation: Designation ={
    id: 1,
    name: '',
    designationCode: '',
    r_domainToDesignation_c_domainId: 1,
    domain: {
      id: 1,
      title: ''
    }
  }

   //to get the action menu
   expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //To call the create Designation form
  addDesignation() { this.isAddMode = true }

  //Creating Designation
  createDesignation() {
    this.designation.r_domainToDesignation_c_domainId = this.designation.domain.id;
    this.designationService.createDesignation(this.designation).subscribe({
      next: (data: Designation) => {
        this.refreshDesignationList();
        alert('Designation created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewDesignation = false;

      },
      error: (error) => {
        console.error('Error creating designation:', error);
      },
    });
  }

  //Editing Designation fuctions
  editDesignation(id: number) {
    this.designation.id = id;
    this.isEditMode = true;
    this.designationService.findDesignation(id).subscribe({
      next: (data: any) => {
        this.designation.name = data.name;
        this.designation.designationCode = data.designationCode;
        if (data.r_domainToDesignation_c_domainId) {
          this.designation.domain.id = data.r_domainToDesignation_c_domainId;
          this.domainService.findDomain(this.designation.domain.id).subscribe({
            next: (data: any) => {
              this.designation.domain.title = data.title;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching designation data:', error);
      }
    });
  }
  updateDesignation() {
    var designation = {
      id: this.designation.id,
      name: this.designation.name,
      designationCode: this.designation.designationCode,
      r_domainToDesignation_c_domainId: this.designation.domain.id,
      domain: {
        id: this.designation.domain.id,
        title: this.designation.domain.title,
      }
    }
    this.designationService.updateDesignation(designation).subscribe({
      next: (updatedData: any) => {
        this.refreshDesignationList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of Designation function
  viewDetail(id: number) {
    this.viewDesignation = true
    this.designationService.findDesignation(id).subscribe({
      next: (data: any) => {
        this.designationData = data;
        this.domainService.findDomain(this.designationData.r_domainToDesignation_c_domainId).subscribe({
          next: (data: any) => {
            this.domainData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting Designation data
  deleteDesignation(id: number): void {
    this.designationService.deleteDesignation(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Designation deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting designation:', error);
      }
    });
  }

  //Get all sector list
  refreshDesignationList() {
    //get all sectors data for list view
    this.designationService.getAllDesignation().subscribe({
      next: (response: any) => {
        this.designationData = response.items;
        console.log(JSON.stringify(this.designationData))
        this.designationData.forEach((designation: Designation) => {
          if (designation.r_domainToDesignation_c_domainId != 0) {
            const r_domainToDesignation_c_domainId = designation.r_domainToDesignation_c_domainId;
            this.domainService.findDomain(r_domainToDesignation_c_domainId).subscribe({
              next: (domainData: any) => {
                designation.domain = domainData;
                this.isLoaded = true;
              },
              error: (error: any) => {
                console.error('Error fetching designation data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.designation = {
      id: 0,
      name: '',
      designationCode: '',
      r_domainToDesignation_c_domainId: 0,
      domain: {
        id: 0,
        title: '',
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshDesignationList();

    //get all domains data in sectors for the dropdown
    this.domainService.getAllDomains().subscribe({
      next: (response: any) => {
        this.domainData = response.items;
        this.domainData.forEach((domain: DomainInCourse) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching domains:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }
}

