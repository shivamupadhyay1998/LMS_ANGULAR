import { Component } from '@angular/core';
import { CurrencyService } from '../service/currency.service';
import { CountryService } from '../../country/service/country.service';
import { Currency } from '../model/currency.model';
import { Country } from '../../country/model/country.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [NgFor,NgIf, FormsModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent {
  constructor(private currencyService: CurrencyService, private countryService : CountryService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewCurrency: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  currencyData: any;
  countryData: any;

  currency: Currency ={
    id: 0,
    currencyCode: '',
    currencyName: '',
    country: {
      id: 0,
      name: ''
    },
    r_countryToCurrency_c_countryId: ''
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
    if (this.viewCurrency) { 
      this.currencyData = '';
      this.viewCurrency = false;
      this.refreshCurrencyList();
    }
  }

  //To call the create state form
  addCurrency() { this.isAddMode = true }

  //Creating state
  createCurrency() {
    this.currency.r_countryToCurrency_c_countryId = this.currency.country.id;
    console.log(this.currency.r_countryToCurrency_c_countryId)
    this.currencyService.createCurrency(this.currency).subscribe({
      next: (data: Currency) => {
        this.refreshCurrencyList();
        alert('Currency created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewCurrency = false;

      },
      error: (error) => {
        console.error('Error creating currency:', error);
      },
    });
  }

  //Editing state fuctions
  editCurrency(id: number) {
    this.currency.id = id;
    this.isEditMode = true;
    this.currencyService.findCurrency(this.currency.id).subscribe({
      next: (data: any) => {
        this.currency.currencyName = data.currencyName;
        this.currency.currencyCode = data.currencyCode;
        if (data.r_countryToCurrency_c_countryId) {
          this.currency.country.id = data.r_countryToCurrency_c_countryId;
          this.countryService.findCountry(this.currency.country.id).subscribe({
            next: (countryData: any) => {
              this.currency.country.name = countryData.name;
            },
            error: (error: any) => {
              console.error('Error fetching country data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching currency data:', error);
      }
    });
  }
  updateCurrency() {
    var currency = {
      id: this.currency.id,
      currencyName: this.currency.currencyName,
      currencyCode: this.currency.currencyCode,
      r_countryToCurrency_c_countryId: this.currency.country.id,
      country: {
        id: this.currency.country.id,
        name: this.currency.country.name,
      }
    }
    this.currencyService.updateCurrency(currency).subscribe({
      next: (updatedData: any) => {
        this.refreshCurrencyList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of state function
  viewDetail(id: number) {
    this.viewCurrency = true
    this.currencyService.findCurrency(id).subscribe({
      next: (data: any) => {
        this.currencyData = data;
        this.countryService.findCountry(this.currencyData.r_countryToCurrency_c_countryId).subscribe({
          next: (data: any) => {
            this.countryData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting state data
  deleteCurrency(id: number): void {
    this.currencyService.deleteCurrency(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Currency deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting currency:', error);
      }
    });
  }

  //Get all sector list
  refreshCurrencyList() {
    //get all sectors data for list view
    this.currencyService.getAllCurrencies().subscribe({
      next: (response: any) => {
        this.currencyData = response.items;
        this.currencyData.forEach((currency: Currency) => {
          if (currency.r_countryToCurrency_c_countryId != 0) {
            const r_countryToCurrency_c_countryId = currency.r_countryToCurrency_c_countryId;
            this.countryService.findCountry(r_countryToCurrency_c_countryId).subscribe({
              next: (countryData: any) => {
                currency.country = countryData;
                this.isLoaded = true;
              },
              error: (error: any) => {
                console.error('Error fetching currency data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.currency = {
      id: 0,
      currencyName: '',
      currencyCode: '',
      r_countryToCurrency_c_countryId: '',
      country: {
        id: 0,
        name: '',
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshCurrencyList();

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