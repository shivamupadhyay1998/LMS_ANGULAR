import { Component } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CountryService } from '../service/country.service';
import { Country } from '../model/country.model';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, DatePipe],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent {
  constructor(private countryService: CountryService, private router: Router) { }

  //Variables
  countryData: any;
  isExtended: boolean = false;
  viewCountry: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetCountry: any = {};
  country: Country = {
    id: 0,
    name: '',
    iSOCode: '',
    countryCode: '',
    callCode: '',
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
    if (this.viewCountry) { 
      this.countryData = '';
      this.viewCountry = false;
      this.refreshCountryList();
    }
  }

  // Function to call the create form 
  addCountry() {
    this.isAddMode = true
  }
  //Function to create a country
  createCountry() {
    this.countryService.createCountry(this.country).subscribe({
      next: (data: Country) => {
        alert('Country created successfully:'); 
        this.resetForm();
        this.refreshCountryList();
        this.isAddMode = false;
        this.viewCountry = false;
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error creating country:', error);
      },
    });
  }

  //function to call the country data in form fields to edit it
  editCountry(id: any) {
    this.isEditMode = true;
    this.country.id = id;
    if (this.country.id) {
      this.countryService.findCountry(this.country.id).subscribe({
        next: (response: any) => {
          this.country = response
          this.isLoaded = true
        },
        error: (error) => {
          console.error('Error fetching country data:', error);
        }
      });
    }
  }

  //function to update the country
  updateCountry() {
    var country = {
      id: this.country.id,
      name: this.country.name,
      countryCode: this.country.countryCode,
      iSOCode: this.country.iSOCode,
      callCode: this.country.callCode
    }
    this.countryService.updateCountry(country).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshCountryList();
        alert("Data updated successfully")
        this.isEditMode = false;
      }
    })
  }

  //function to view the detail of Country data
  viewDetail(id: number) {
    this.viewCountry = true
    this.countryService.findCountry(id).subscribe({
      next: (data: any) => {
        this.countryData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a Country
  deleteCountry(id: number): void {
    this.countryService.deleteCountry(id).subscribe({
      next: () => {
        this.refreshCountryList();
        if (this.isDeleted) {
          alert(`Country with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting country:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshCountryList();
  }

  //Get all the countrys
  private refreshCountryList(): void {
    this.countryService.getAllCountrys().subscribe({
      next: (response: any) => {
        this.countryData = response.items;
        this.isLoaded = true;
      },
      error: (error: any) => {
        console.error('Error fetching countrys:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.country = {
      id: 0,
      name: '',
      countryCode: '',
      callCode: '',
      iSOCode: ''
    }
  }
}