import { Component, OnInit } from '@angular/core';
import { LessonService } from '../../../service/lesson.service';
import { TopicService } from '../../../../topic/service/topic.service';
import { PicklistService } from '../../../../picklist-service/picklist.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { LessonInTopic, Topic } from '../../../../topic/model/topic.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topicbylesson',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './topicbylesson.component.html',
  styleUrl: './topicbylesson.component.scss'
})
export class TopicbylessonComponent implements OnInit{

  isloaded: boolean = false;
  isExtended: boolean = false;
  viewTopic: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  lessonData: any;
  topicData: any;
  lesson: LessonInTopic[] = [];
  activeData: any[] = [];

  topic: Topic = {
    id: 0,
    r_lessonToTopic_c_lessonId: '',
    topicName: '',
    summary: '',
    completionTimeInHrs: '',
    active: {
      key: '',
      name: ''
    },
    sequenceNo: '',
    textContent: '',
    imageContent: {},
    videoContent: {},
    document: {},
    lesson: {
      id: 0,
      lessonName: ''
    }
  }
  constructor(private lessonService: LessonService,
    private topicService: TopicService,
    private picklistService: PicklistService,
    private datePipe: DatePipe,
  ) { }

  //upload file
  selectedFiles: { [key: string]: File } = {};
  filenames: string[] = [];
  isUploaded: boolean = false;
  fileUpdated: boolean = false;
  documentData: any[] = [];
  file: File | any;
  fileType: string = '';
  successfullyUploadedFiles: number = 0;

  onFileSelected(event: any) {
    const inputElement = event.target as HTMLInputElement;
    this.file = (inputElement.files as FileList)[0];
    this.fileType = this.file.type;
    if (this.file) {
      this.selectedFiles[this.file.type] = this.file;
      this.fileUpdated = true;
    }
  }

  //add topic 
  addTopic() { this.isAddMode = true }

  uploadDocuments() {
    const filesToUpload = Object.values(this.selectedFiles);
    this.successfullyUploadedFiles = 0;
    filesToUpload.forEach((file: File) => {
      this.uploadFile(file);
    });

  }
  renameFile(file: File): File {
    const fileName = file.name;
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const timestamp = new Date().getTime();
    const newName = baseName + '_' + timestamp + extension;
    return new File([file], newName, { type: file.type });
  }

  uploadFile(file: File) {
    if (file) {
      file = this.renameFile(file);
      this.topicService.uploadfile(file).subscribe({
        next: (uploadData: any) => {
          if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
            this.topic.imageContent = uploadData.id;
          } else if (file.type === 'video/mp4') {
            this.topic.videoContent = uploadData.id;
          } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain') {
            this.topic.document = uploadData.id;
          }
          this.isUploaded = true;
          this.successfullyUploadedFiles++;
          if (this.successfullyUploadedFiles === Object.keys(this.selectedFiles).length) {
            if (this.isAddMode) {
              this.createTopicCall();
            } else {
              this.updateTopicCall();
            }
          }
        },
        error: (error: any) => {
          console.error(`Error uploading ${file}:`, error);
        }
      });
    }
  }

  createTopic() {
    if (this.fileUpdated) {
      this.uploadDocuments();
    } else {
      this.createTopicCall();
    }
  }

  createTopicCall() {
    if (this.topic.active) {
      this.topic.active.key = this.topic.active.name.toLowerCase();
    }
    if (this.fileUpdated = true) {
      if (this.topic.imageContent) {
        this.topic.imageContent = this.topic.imageContent ? this.topic.imageContent : '';
      }
      if (this.topic.videoContent) {
        this.topic.videoContent = this.topic.videoContent ? this.topic.videoContent : '';
      }
      if (this.topic.document) {
        this.topic.document = this.topic.document ? this.topic.document : '';
      }
    }
    this.topicService.createTopic(this.topic).subscribe({
      next: (data: any) => {
        alert('Topic created successfully: ');
        this.resetForm();
        this.refreshTopicList();
        this.isAddMode = false;
      },
      error: (error) => {
        console.error('Error creating topic:', error);
      },
    });
  }

  //update topic
  editTopic(id: number) {
    this.isEditMode = true;
    this.topic.id = id;
    this.topicService.findTopic(this.topic.id).subscribe({
      next: (data: any) => {
        this.topic.topicName = data.topicName;
        this.topic.summary = data.summary;
        this.topic.sequenceNo = data.sequenceNo;
        this.topic.completionTimeInHrs = data.completionTimeInHrs;
        if (data.active) {
          this.topic.active = data.active;
        }
        this.topic.textContent = data.textContent;
        this.topic.imageContent = data.imageContent;
        this.topic.document = data.document;
        this.topic.videoContent = data.videoContent;
        if (data.r_lessonToTopic_c_lessonId) {
          this.topic.lesson.id = data.r_lessonToTopic_c_lessonId;
          this.lessonService.findLesson(this.topic.lesson.id).subscribe({
            next: (data: any) => {
              this.topic.lesson.lessonName = data.lessonName;
            }
          })
        }
      }
    })
  }
  updateTopic() {
    if (this.fileUpdated) {
      this.uploadDocuments();
    } else {
      this.updateTopicCall();
    }
  }

  updateTopicCall() {
    if (this.topic.active) {
      this.topic.active.key = this.topic.active.name.toLowerCase();
    }
    if (this.fileUpdated && this.topic.imageContent) {
      if (this.topic.imageContent.id) {
        this.topic.imageContent = this.topic.imageContent.id
      } else {
        this.topic.imageContent = this.topic.imageContent
      }
    }
    if (this.fileUpdated && this.topic.videoContent) {
      if (this.topic.videoContent.id) {
        this.topic.videoContent = this.topic.videoContent.id
      } else {
        this.topic.videoContent = this.topic.videoContent
      }
    }
    if (this.fileUpdated && this.topic.document) {
      if (this.topic.document.id) {
        this.topic.document = this.topic.document.id
      } else {
        this.topic.document = this.topic.document
      }
    }

    var topic = {
      id: this.topic.id,
      topicName: this.topic.topicName,
      summary: this.topic.summary,
      completionTimeInHrs: this.topic.completionTimeInHrs,
      active: this.topic.active,
      sequenceNo: this.topic.sequenceNo,
      textContent: this.topic.textContent,
      imageContent: this.topic.imageContent,
      videoContent: this.topic.videoContent,
      document: this.topic.document,
      r_lessonToTopic_c_lessonId: this.topic.r_lessonToTopic_c_lessonId,
      lesson: {
        id: this.topic.lesson.id,
        lessonName: this.topic.lesson.lessonName
      }
    }
    this.topicService.updateTopic(topic).subscribe({
      next: (data: any) => {
        alert('Topic updated successfully: ');
        this.resetForm();
        this.refreshTopicList();
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error updating topic:', error);
      },
    });
  }

  //delete topic
  deleteTopic(id: number) {
    this.topicService.deleteTopic(id).subscribe({
      next: () => {
        alert('Topic deleted successfully.');
        this.refreshTopicList();
        this.refreshPage();
      },
      error: (error: any) => {
        console.error('Error deleting topics:', error);
      }
    });
  }

  //view detail
  viewDetail(id: number) {
    this.viewTopic = true
    this.topicService.findTopic(id).subscribe({
      next: (data: any) => {
        this.topicData = data;
        this.topicData.dateCreated = this.formatDate(data.dateCreated);
        this.topicData.dateModified = this.formatDate(data.dateModified)
        if (data.r_lessonToTopic_c_lessonId) {
          const lessonId = this.topicData.r_lessonToTopic_c_lessonId;
          this.lessonService.findLesson(lessonId).subscribe({
            next: (lessonData: any) => {
              this.lessonData = lessonData;
              this.isLoaded = true;
            }
          });
        }
      }
    })
  }

  refreshTopicList() {
    const id=this.lessonService.getTopicByLessonId();
    this.lessonService.getAllTopicsByLessonId(id).subscribe({
      next: (response: any) => {
        this.topicData = response.items;
        this.topicData.forEach((topic: Topic) => {

          if (topic.r_lessonToTopic_c_lessonId != 0) {
            const lessonId = topic.r_lessonToTopic_c_lessonId;
            this.lessonService.findLesson(lessonId).subscribe({
              next: (lessonData: LessonInTopic) => {
                topic.lesson = lessonData;
              },
              error: (error: any) => {
                console.error('Error fetching course data:', error);
              }
            });
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching course:', error);
      }
    }
    )
  }

  ngOnInit(): void {
    this.refreshTopicList();
    this.lessonService.getAllLessons().subscribe({
      next: (response: any) => {
        this.lessonData = response.items;
        this.lessonData.forEach((lesson: LessonInTopic) => {
        });
      }
    })

    this.picklistService.getActiveData().subscribe({
      next: (response) => {
        this.activeData = response.listTypeEntries;
      }
    })
  }

  formattedDate: any;
  formatDate(_date: Date) {
    this.formattedDate = this.datePipe.transform(_date, 'dd-MM-YYYY');
    return this.formattedDate;
  }

  refreshPage() {
    window.location.reload();
  }

  resetForm() {
    this.topic = {
      id: 0,
      r_lessonToTopic_c_lessonId: '',
      topicName: '',
      summary: '',
      completionTimeInHrs: '',
      active: {
        key: '',
        name: ''
      },
      sequenceNo: '',
      textContent: '',
      imageContent: '',
      videoContent: '',
      document: '',
      lesson: {
        id: 0,
        lessonName: ''
      }
    }
    this.selectedFiles = {}
  }
  
}
