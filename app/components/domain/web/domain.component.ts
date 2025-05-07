import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomainService } from '../service/domain.service';
import { Domain } from '../model/domain.model';

@Component({
  selector: 'app-domain',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './domain.component.html',
  styleUrl: './domain.component.scss'
})
export class DomainComponent {
  constructor(private domainService: DomainService, private router: Router) { }

  //Variables
  domainData: any;
  isExtended: boolean = false;
  viewDomain: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetDomain: any = {};
  domain: Domain = {
    id: 0,
    title: '',
    description: '',
  };

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  // Function to call the create form 
  addDomain() {
    this.isAddMode = true
  }
  //Function to create a domain
  createDomain() {
    this.domainService.createDomain(this.domain).subscribe({
      next: (data: Domain) => {
        this.resetForm();
        alert('Domain created successfully:');
        this.refreshDomainList();
        this.isAddMode = false;
        this.viewDomain = false;
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error creating domain:', error);
      },
    });
  }

  //function to call the domain data in form fields to edit it
  editDomain(id: any) {
    this.isEditMode = true;
    this.domain.id = id;
    if (this.domain.id) {
      this.domainService.findDomain(this.domain.id).subscribe({
        next: (response: any) => {
          this.domain = response
          this.isLoaded = true
        },
        error: (error) => {
          console.error('Error fetching domain data:', error);
        }
      });
    }
  }

  //function to update the domain
  updateDomain() { 
    var domain = {
      id: this.domain.id,
      title: this.domain.title,
      description: this.domain.description
    }
    this.domainService.updateDomain(domain).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshDomainList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of Domain data
  viewDetail(id: number) {
    this.viewDomain = true
    this.domainService.findDomain(id).subscribe({
      next: (data: any) => {
        this.domainData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a Domain
  deleteDomain(id: number): void {
    this.domainService.deleteDomain(id).subscribe({
      next: () => {
        this.refreshDomainList();
        if (this.isDeleted) {
          alert(`Domain with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting domain:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshDomainList();
  }

  //Get all the domains
  private refreshDomainList(): void {
    this.domainService.getAllDomains().subscribe({
      next: (response: any) => {
        this.domainData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching domains:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.domain = {
      id:0,
      title: '',
      description: ''
    }
  }

}
