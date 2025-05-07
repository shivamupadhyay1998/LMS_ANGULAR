import { Component } from '@angular/core';
import { VocabularyService } from '../../service/vocabulary.service';
import { DomainService } from '../../../domain/service/domain.service';
import { Vocabulary } from '../../model/vocabulary.model';
import { Domain } from '../../../domain/model/domain.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vocabulary',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './vocabulary.component.html',
  styleUrl: './vocabulary.component.scss'
})
export class VocabularyComponent {

  constructor(private vocabularyService: VocabularyService,
    private domainService: DomainService) { }

  //Variables

  isloaded: boolean = false;
  isExtended: boolean = false;
  viewVocabulary: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  vocabularyData: any;
  domainData: any;
  vocabulary: Vocabulary = {
    titleCurrentValue: '',
    domain: {
      id: 0,
      title: '',
    },
    id: 0
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
    if (this.viewVocabulary) { 
      this.vocabularyData = '';
      this.viewVocabulary = false;
      this.refreshVocabularyList();
    }
  }

  //Creating vocabulary functions
  addVocabulary() { this.isAddMode = true }
  createVocabulary() {
    this.vocabularyService.createVocabulary(this.vocabulary).subscribe({
      next: (data: Vocabulary) => {
        console.log(JSON.stringify(data));
        this.refreshPage();
        alert('Vocabulary created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewVocabulary = false;

      },
      error: (error) => {
        console.error('Error creating vocabularys:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing vocabulary fuctions
  editVocabulary(id: number) {
    this.isEditMode = true;
    this.vocabulary.id = id;
    this.vocabularyService.findVocabulary(id).subscribe({
      next: (data: any) => {
        this.vocabulary.titleCurrentValue= data.titleCurrentValue;
        if (data.r_domainToVocabulary_c_domainId) {
          this.vocabulary.domain.id = data.r_domainToVocabulary_c_domainId;
          this.domainService.findDomain(this.vocabulary.domain.id).subscribe({
            next: (domainData: any) => {
              this.vocabulary.domain.title = domainData.title;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching vocabulary data:', error);
      }
    });
  }
  updateVocabulary() {
    var vocabulary = {
      id: this.vocabulary.id ,
      titleCurrentValue: this.vocabulary.titleCurrentValue,
      domain: {
        id: this.vocabulary.domain.id,
        title: this.vocabulary.domain.title,
      }
    }
    this.vocabularyService.updateVocabulary(vocabulary).subscribe({
      next: (updatedData: any) => {
        this.refreshVocabularyList();
        alert("Data updated successfully")
        this.resetForm();
        console.log("updatedData " + JSON.stringify(updatedData))
        this.isEditMode = false;
      }
    })
  }

  //View detail of vocabulary function
  viewDetail(id: number) {
    this.viewVocabulary = true
    this.vocabularyService.findVocabulary(id).subscribe({
      next: (data: any) => {
        this.vocabularyData = data;
        this.domainService.findDomain(this.vocabularyData.r_domainToVocabulary_c_domainId).subscribe({
          next: (data: any) => {
            this.domainData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting vocabulary data
  deleteVocabulary(id: number): void {
    console.log(id)
    this.vocabularyService.deleteVocabulary(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Vocabulary deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting vocabulary:', error);
      }
    });
  }

  //Get all vocabulary list
  refreshVocabularyList() {
    //get all vocabularys data for list view
    this.vocabularyService.getAllVocabularys().subscribe({
      next: (response: any) => {
        this.vocabularyData = response.items;
        this.vocabularyData.forEach((vocabulary: Vocabulary) => {
          if (vocabulary.r_domainToVocabulary_c_domainId != 0) {
            const rDomainCDomainId = vocabulary.r_domainToVocabulary_c_domainId;
            this.domainService.findDomain(rDomainCDomainId).subscribe({
              next: (domainData: any) => {
                vocabulary.domain = domainData;
              },
              error: (error: any) => {
                console.error('Error fetching vocabulary data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.vocabulary = {
      titleCurrentValue: '',
      domain: {
        id: 0,
        title: '',
      },
      id:0
    }
  }

  ngOnInit(): void {
    //get vocabulary list on page load
    this.refreshVocabularyList();

    //get all domains data in vocabularys for the dropdown
    this.domainService.getAllDomains().subscribe({
      next: (response: any) => {
        this.domainData = response.items;
        this.domainData.forEach((domain: Domain) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching vocabularys:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }
}
