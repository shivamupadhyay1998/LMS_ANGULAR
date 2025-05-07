import { Component } from '@angular/core';
import { StateService } from '../service/state.service';
import { State } from '../model/state.model';
import { CountryService } from '../../country/service/country.service';
import { Country } from '../../country/model/country.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './state.component.html',
  styleUrl: './state.component.scss'
})
export class StateComponent {

  constructor(private stateService: StateService, private countryService : CountryService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewSector: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  stateData: any;
  countryData: any;

  state: State ={
    id: 0,
    name: '',
    country: {
      id: 0,
      name: ''
    },
    r_countryToState_c_countryId: ''
  }

   //to get the action menu
   expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //To call the create state form
  addState() { this.isAddMode = true }

  //Creating state
  createState() {
    this.state.r_countryToState_c_countryId = this.state.country.id;
    this.stateService.createState(this.state).subscribe({
      next: (data: State) => {
        this.refreshStateList();
        alert('State created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewSector = false;

      },
      error: (error) => {
        console.error('Error creating states:', error);
      },
    });
  }

  //Editing state fuctions
  editState(id: number) {
    this.state.id = id;
    this.isEditMode = true;
    this.stateService.findState(id).subscribe({
      next: (data: any) => {
        this.state.name = data.name;
        if (data.r_countryToState_c_countryId) {
          this.state.country.id = data.r_countryToState_c_countryId;
          this.countryService.findCountry(this.state.country.id).subscribe({
            next: (countryData: any) => {
              this.state.country.name = countryData.name;
            },
            error: (error: any) => {
              console.error('Error fetching country data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching state data:', error);
      }
    });
  }
  updateState() {
    var state = {
      id: this.state.id,
      name: this.state.name,
      r_countryToState_c_countryId: this.state.country.id,
      country: {
        id: this.state.country.id,
        name: this.state.country.name,
      }
    }
    this.stateService.updateState(state).subscribe({
      next: (updatedData: any) => {
        this.refreshStateList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of state function
  viewDetail(id: number) {
    this.viewSector = true
    this.stateService.findState(id).subscribe({
      next: (data: any) => {
        this.stateData = data;
        this.countryService.findCountry(this.stateData.r_countryToState_c_countryId).subscribe({
          next: (data: any) => {
            this.countryData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting state data
  deleteState(id: number): void {
    this.stateService.deleteState(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('State deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting state:', error);
      }
    });
  }

  //Get all sector list
  refreshStateList() {
    //get all sectors data for list view
    this.stateService.getAllStates().subscribe({
      next: (response: any) => {
        this.stateData = response.items;
        this.stateData.forEach((state: State) => {
          if (state.r_countryToState_c_countryId != 0) {
            const r_countryToState_c_countryId = state.r_countryToState_c_countryId;
            this.countryService.findCountry(r_countryToState_c_countryId).subscribe({
              next: (countryData: any) => {
                state.country = countryData;
                this.isLoaded = true;
              },
              error: (error: any) => {
                console.error('Error fetching state data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.state = {
      id: 0,
      name: '',
      r_countryToState_c_countryId: '',
      country: {
        id: 0,
        name: '',
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshStateList();

    //get all domains data in sectors for the dropdown
    this.countryService.getAllCountrys().subscribe({
      next: (response: any) => {
        this.countryData = response.items;
        this.countryData.forEach((country: Country) => {
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
