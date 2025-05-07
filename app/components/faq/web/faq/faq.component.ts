import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../service/faq.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FAQ } from '../../model/faq.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {

  constructor(private faqService: FaqService,
    private datePipe: DatePipe,
    private router: Router) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewFAQ: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  faqData: any;


  //for image upload
  file: File | any;
  filenames: string[] = [];
  isUploaded: boolean = false;
  fileUpdated: boolean = false;
  thumbnailImageData: any[] = [];

  faq: FAQ = {
    id: 0,
    title: '',
    question: '',
    content: '',
    externalLink: '',
    image: '',
  }

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //Creating sector functions
  handleImageUpload(event?: Event) {
    if (!event) return;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      this.fileUpdated = true;
    }
  }

  renameFile(file: File): File {
    const fileName = file.name;
    let baseName = fileName.substring(0, fileName.lastIndexOf('.')); // Get the base name before the extension

    // Check if the base name ends with "_digits"
    const regex = /_\d+\./;
    if (regex.test(baseName)) {
      // Remove the digits from the base name
      baseName = baseName.replace(/_\d+\.$/, '.');
    }
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const timestamp = new Date().getTime();
    const newName = baseName + '_' + timestamp + extension;
    return new File([file], newName, { type: file.type });
  }

  uploadImage() {
    if (this.file) {
      this.file = this.renameFile(this.file);
      this.faqService.uploadfile(this.file).subscribe({
        next: (uploadData: any) => {
          this.faq.image = uploadData.id;
          this.isUploaded = true;
          if (this.isAddMode) {
            this.createFAQCall();
          } else this.updateFAQCall()
        },
        error: (error: any) => {
          console.error("Error uploading image:", error);
        }
      });
    }
  }
  addFAQ() {
    this.isAddMode = true;
  }
  createFAQ() {
    this.handleImageUpload()
    if (this.fileUpdated == true) {
      this.uploadImage();
    } else {
      this.createFAQCall();
    }

  }
  createFAQCall() {
    if (this.fileUpdated = true) {
      this.faq.image = this.faq.image ? this.faq.image : '';
    }
    this.faqService.createFAQ(this.faq).subscribe({
      next: (data: FAQ) => {
        alert('FAQ created successfully:');
        this.resetForm();
        this.refreshFAQList();
        this.isAddMode = false;
        this.viewFAQ = false;
      },
      error: (error) => {
        console.error('Error creating faq:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing sector fuctions
  editFAQ(id: number) {
    this.isEditMode = true;
    this.faq.id = id;
    this.faqService.findFAQ(this.faq.id).subscribe({
      next: (data: any) => {
        this.faq.title = data.title;
        this.faq.question = data.question;
        this.faq.content = data.content;
        this.faq.externalLink = data.externalLink;
        this.faq.image = data.image ? data.image.id : '';
        if (data.image) {
          this.faqService.getUploadedfile(this.faq.image).subscribe({
            next: (imageData: any) => {
              this.faq.image = imageData;
              if (this.faq.image && this.faq.image.fileName) {
                this.file = this.faq.image.fileName;
              }
            },
            error: (error) => {
              console.error('Error fetching image data:', error);
            }
          });
        }
      }
    })
  }
  updateFAQ() {
    if (this.fileUpdated == true) {
      this.uploadImage();
    } else {
      this.updateFAQCall();
    }

  }

  updateFAQCall() {
    if (this.fileUpdated) {
      this.faq.image = this.faq.image
    } else this.faq.image = this.faq.image.id
    var faq = {
      id: this.faq.id,
      title: this.faq.title,
      question: this.faq.question,
      content: this.faq.content,
      externalLink: this.faq.externalLink,
      image: this.faq.image ? this.faq.image : '',
    }
    this.faqService.updateFAQ(faq).subscribe({
      next: (data: any) => {
        alert("Data updated successfully.");
        this.resetForm();
        this.refreshFAQList();
        this.isEditMode = false;
      }
    })
  }

  //View detail of sector function
  viewDetail(id: number) {
    this.viewFAQ = true
    this.faqService.findFAQ(id).subscribe({
      next: (data: any) => {
        this.faqData = data;
      }
    })
  }

  // Deleting sector data
  deleteFAQ(id: number): void {
    this.faqService.deleteFAQ(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('FAQ deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting FAQ:', error);
      }
    });
  }

  refreshFAQList() {
    this.faqService.getAllFAQs().subscribe({
      next: (response: any) => {
        this.faqData = response.items;
        this.faqData.forEach((faq: FAQ) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching faq:', error);
      }
    })
  }

  ngOnInit(): void {
    this.refreshFAQList();

  }

  formattedDate: any;
  formatDate(_date: Date) {
    this.formattedDate = this.datePipe.transform(_date, 'yyyy-MM-dd');
    return this.formattedDate;
  }

  refreshPage() {
    window.location.reload();
  }

  resetForm() {
    this.faq = {
      id: 0,
      title: '',
      question: '',
      content: '',
      externalLink: '',
      image: '',
    }
  }
}

