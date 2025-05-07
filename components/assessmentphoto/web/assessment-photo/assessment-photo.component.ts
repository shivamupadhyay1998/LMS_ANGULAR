import { Component } from '@angular/core';
import { AssessmentPhotoService } from '../../service/assessment-photo.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AssessmentPhoto } from '../../model/assessment.model';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-assessment-photo',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './assessment-photo.component.html',
  styleUrl: './assessment-photo.component.scss'
})
export class AssessmentPhotoComponent {
  constructor(private assessmentPhotoService: AssessmentPhotoService,
    private datePipe: DatePipe,
    private router: Router) { }

  //Variables
  id: number = 0;
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewAssessmentPhoto: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  assessmentPhotoData: any;


  //for photo upload
  file: File | any;
  filenames: string[] = [];
  isUploaded: boolean = false;
  fileUpdated: boolean = false;
  thumbnailPhotoData: any[] = [];

  assessmentPhoto: AssessmentPhoto = {
    name: '',
    photo: '',
    attemptId: '',
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
    if (this.viewAssessmentPhoto) { 
      this.assessmentPhotoData = '';
      this.viewAssessmentPhoto = false;
      this.refreshAssessmentPhotoList();
    }
  }

  //Creating sector functions
  handlePhotoUpload(event?: Event) {
    if (!event) return;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0]; console.log("handle upload in assessmentPhoto" + this.file)
      this.fileUpdated = true;
    }
  }

  renameFile(file: File): File {
    const fileName = file.name;
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const timestamp = new Date().getTime();
    const newName = baseName + '_' + timestamp + extension;
    return new File([file], newName, { type: file.type });
  }

  uploadPhoto() {
    console.log("file in upload " + this.file)
    if (this.file) {
      this.file = this.renameFile(this.file);
      console.log("file in upload after rename " + this.file)
      this.assessmentPhotoService.uploadfile(this.file).subscribe({
        next: (uploadData: any) => {
          console.log("upload data " + uploadData)
          this.assessmentPhoto.photo = uploadData.id;
          this.isUploaded = true;
          if (this.isAddMode) {
            this.createAssessmentPhotoCall();
          } else this.updateAssessmentPhotoCall()
        },
        error: (error: any) => {
          console.error("Error uploading photo:", error);
        }
      });
    }
  }
  addAssessmentPhoto() {
    this.isAddMode = true;
  }
  createAssessmentPhoto() {
    this.handlePhotoUpload()
    if (this.fileUpdated == true) {
      console.log(" if file is updated save assessmentPhoto")
      this.uploadPhoto();
    } else {
      this.assessmentPhoto.photo = this.assessmentPhoto.photo.id;
      this.createAssessmentPhotoCall();
      console.log("not updated update assessmentPhoto")
    }

  }
  createAssessmentPhotoCall() {
    this.assessmentPhotoService.createAssessmentPhoto(this.assessmentPhoto).subscribe({
      next: (data: AssessmentPhoto) => {
        this.resetForm();
        this.refreshAssessmentPhotoList();
        alert('AssessmentPhoto created successfully:');
        this.isAddMode = false;
        this.viewAssessmentPhoto = false;

      },
      error: (error) => {
        console.error('Error creating sectors:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing sector fuctions
  editAssessmentPhoto(id: number) {
    this.isEditMode = true;
    this.id = id;
    this.assessmentPhotoService.findAssessmentPhoto(id).subscribe({
      next: (data: any) => {
        console.log("hello"+JSON.stringify(data))
        this.assessmentPhoto.name = data.name;
        this.assessmentPhoto.attemptId = data.attemptId;
        this.assessmentPhoto.photo = data.photo.id;
        console.log("hello"+JSON.stringify(this.assessmentPhoto))
        this.assessmentPhotoService.getUploadedfile(this.assessmentPhoto.photo).subscribe({
          next: (photoData: any) => {
            this.assessmentPhoto.photo = photoData;
            if (this.assessmentPhoto.photo && this.assessmentPhoto.photo.fileName) {
              this.file = this.assessmentPhoto.photo.fileName;
            }
          },
          error: (error) => {
            console.error('Error fetching photo data:', error);
          }
        });
      }
    })
  }
  updateAssessmentPhoto() {
    console.log("**********************")
    if (this.fileUpdated == true) {
      console.log(" if file is updated update assessmentPhoto")
      this.uploadPhoto();
    } else {
      this.assessmentPhoto.photo = this.assessmentPhoto.photo.id
      this.updateAssessmentPhotoCall();
      console.log("not updated update assessmentPhoto")
    }

  }

  updateAssessmentPhotoCall() {
    if (this.isUploaded || !this.fileUpdated) {
      
     
     
      
      var assessmentPhoto = {
        id: this.id,
        name: this.assessmentPhoto.name,
        attemptId: this.assessmentPhoto.attemptId,
        photo: this.assessmentPhoto.photo,
      
      }
      this.assessmentPhotoService.updateAssessmentPhoto(assessmentPhoto).subscribe({
        next: (data: any) => {
          this.resetForm();
          this.refreshAssessmentPhotoList();
          alert("Data updated successfully.");
          this.isEditMode = false;
        }
      })
    }
  }

  //View detail of sector function
  viewDetail(id: number) {
    this.viewAssessmentPhoto = true
    this.assessmentPhotoService.findAssessmentPhoto(id).subscribe({
      next: (data: any) => {
        this.assessmentPhotoData = data;
        console.log(JSON.stringify(this.assessmentPhotoData));
      }
    })
  }

  openLesson() {
    this.router.navigate(['lesson']);
  }

  // Deleting sector data
  deleteAssessmentPhoto(id: number): void {
    console.log(id)
    this.assessmentPhotoService.deleteAssessmentPhoto(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('AssessmentPhoto deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting AssessmentPhoto:', error);
      }
    });
  }

  refreshAssessmentPhotoList() {
    this.assessmentPhotoService.getAllAssessmentPhotos().subscribe({
      next: (response: any) => {
        this.assessmentPhotoData = response.items;
        this.assessmentPhotoData.forEach((assessmentPhoto: AssessmentPhoto) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching assessmentPhoto:', error);
      }
    })
  }

  ngOnInit(): void {
    this.refreshAssessmentPhotoList();
    
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
    this.assessmentPhoto = {
      name: '',
      photo: '',
      attemptId: '',
      id:0,

    }
  }
}

