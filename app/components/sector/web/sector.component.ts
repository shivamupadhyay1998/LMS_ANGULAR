import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomainService } from '../../domain/service/domain.service';
import { Sector } from '../model/sector.model';
import { SectorService } from '../service/sector.service';
import { Domain } from '../../domain/model/domain.model';

@Component({
  selector: 'app-sector',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './sector.component.html',
  styleUrl: './sector.component.scss'
})
export class SectorComponent implements OnInit {

  constructor(private sectorService: SectorService,
    private domainService: DomainService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewSector: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  sectorData: any;
  domainData: any;
  sector: Sector = {
    title: '',
    description: '',
    domain: {
      id: 0,
      title: '',
    },
    id: 0,
    r_domain_c_domainId: ''
  }

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //Creating sector functions
  addSector() { this.isAddMode = true }
  createSector() {
    this.sector.r_domain_c_domainId = this.sector.domain.id;
    this.sectorService.createSector(this.sector).subscribe({
      next: (data: Sector) => {
        this.refreshPage();
        alert('Sector created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewSector = false;

      },
      error: (error) => {
        console.error('Error creating sectors:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing sector fuctions
  editSector(id: number) {
    this.isEditMode = true;
    this.sector.id = id;
    this.sectorService.findSector(this.sector.id).subscribe({
      next: (data: any) => {
        this.sector.title = data.title;
        this.sector.description = data.description;
        if (data.r_domain_c_domainId) {
          this.sector.domain.id = data.r_domain_c_domainId;
          this.domainService.findDomain(this.sector.domain.id).subscribe({
            next: (domainData: any) => {
              this.sector.domain.title = domainData.title;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching sector data:', error);
      }
    });
  }
  updateSector() {
    this.sector.r_domain_c_domainId = this.sector.domain.id;
    var sector = {
      id: this.sector.id,
      title: this.sector.title,
      description: this.sector.description,
      r_domain_c_domainId: this.sector.r_domain_c_domainId,
      domain: {
        id: this.sector.domain.id,
        title: this.sector.domain.title,
      }
    }
    this.sectorService.updateSector(sector).subscribe({
      next: (updatedData: any) => {
        this.refreshSectorList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of sector function
  viewDetail(id: number) {
    this.viewSector = true
    this.sectorService.findSector(id).subscribe({
      next: (data: any) => {
        this.sectorData = data;
        this.domainService.findDomain(this.sectorData.r_domain_c_domainId).subscribe({
          next: (data: any) => {
            this.domainData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting sector data
  deleteSector(id: number): void {
    this.sectorService.deleteSector(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Sector deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting sector:', error);
      }
    });
  }

  //Get all sector list
  refreshSectorList() {
    //get all sectors data for list view
    this.sectorService.getAllSectors().subscribe({
      next: (response: any) => {
        this.sectorData = response.items;
        this.sectorData.forEach((sector: Sector) => {
          if (sector.r_domain_c_domainId != 0) {
            const rDomainCDomainId = sector.r_domain_c_domainId;
            this.domainService.findDomain(rDomainCDomainId).subscribe({
              next: (domainData: any) => {
                sector.domain = domainData;
              },
              error: (error: any) => {
                console.error('Error fetching sector data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.sector = {
      id: 0,
      title: '',
      description: '',
      r_domain_c_domainId: '',
      domain: {
        id: 0,
        title: '',
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshSectorList();

    //get all domains data in sectors for the dropdown
    this.domainService.getAllDomains().subscribe({
      next: (response: any) => {
        this.domainData = response.items;
        this.domainData.forEach((domain: Domain) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching sectors:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }
}
