import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomainService } from '../../domain/service/domain.service';
import { PicklistService } from '../../picklist-service/picklist.service';
import { SectorService } from '../../sector/service/sector.service';
import { Course } from '../model/course.model';
import { CourseService } from '../service/course.service';
import { Domain } from '../../domain/model/domain.model';
import { Sector } from '../../sector/model/sector.model';
import { LessonComponent } from '../../lesson/web/lesson.component';
import { Lesson } from '../../lesson/model/lesson.model';
import { LessonService } from '../../lesson/service/lesson.service';
import { LessonbycourseComponent } from "./lessonbycourse/lessonbycourse/lessonbycourse.component";

@Component({
    selector: 'app-course',
    standalone: true,
    templateUrl: './course.component.html',
    styleUrl: './course.component.scss',
    imports: [NgFor, NgIf, FormsModule, LessonComponent, LessonbycourseComponent]
})
export class CourseComponent implements OnInit {

  constructor(private courseService: CourseService,
    private sectorService: SectorService,
    private domainService: DomainService,
    private lessonService: LessonService,
    private picklistService: PicklistService,
    private datePipe: DatePipe,
    private router: Router) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewCourse: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  isAddLessonMode:boolean = false;
  isEditLessonMode:boolean = false;
  courseData: any;
  lessonData:any;
  domainData: any;
  sectorData: any;
  courseToLessonId:any;
  membershipData: any[] = [];
  activeData: any[] = [];
  levelData: any[] = [];
  dayData: any[] = [];

  //for image upload
  file: File | any;
  filenames: string[] = [];
  isUploaded: boolean = false;
  fileUpdated: boolean = false;
  thumbnailImageData: any[] = [];

  course: Course = {
    id: 0,
    courseTitle: '',
    description: '',
    courseURL: '',
    cPECredit: '',
    thumbnailImage: {},
    startDate: new Date,
    endDate: new Date,
    role: '',
    passingMarks: '',
    courseMembership: {
      key: '',
      name: ''
    },
    active: {
      key: '',
      name: ''
    },
    level: {
      key: '',
      name: ''
    },
    domain: {
      id: 0,
      title: ''
    },
    sector: {
      id: 0,
      title: ''
    },
    r_domainToCourse_c_domainId: '',
    r_sectorToCourse_c_sectorId: ''
  }

  lesson: Lesson = {
    id: 0,
    r_courseToLesson_c_courseId: '',
    lessonName: '',
    summary: '',
    completionTimeInHrs: '',
    active: {
      key: '',
      name: ''
    },
    course: {
      id: 0,
      courseTitle: '',
    },
    day: {
      key: '',
      name: ''
    },
    sequenceNo: '',
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
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
    const timestamp = new Date().getTime();
    const newName = baseName + '_' + timestamp + extension;
    return new File([file], newName, { type: file.type });
  }

  uploadImage() {
    if (this.file) {
      this.file = this.renameFile(this.file);
      this.courseService.uploadfile(this.file).subscribe({
        next: (uploadData: any) => {
          this.course.thumbnailImage = uploadData.id;
          this.isUploaded = true;
          if (this.isAddMode) {
            this.createCourseCall();
          } else this.updateCourseCall()
        },
        error: (error: any) => {
          console.error("Error uploading image:", error);
        }
      });
    }
  }
  addCourse() {
    this.isAddMode = true;
  }
  createCourse() {
    this.handleImageUpload();
    if (this.fileUpdated == true) {
      this.uploadImage();
    } else {
      this.createCourseCall();
    }

  }

  createCourseCall() {
    if (this.fileUpdated = true) {
      this.course.thumbnailImage = this.course.thumbnailImage ? this.course.thumbnailImage : '';
    }
    if (this.course.active) {
      this.course.active.key = this.course.active.name.toLowerCase();
    }
    if (this.course.level) {
      this.course.level.key = this.course.level.name.toLowerCase();
    }
    if (this.course.courseMembership) {
      if (this.course.courseMembership.name === 'Open') {
        this.course.courseMembership.key = "1";
      } else if (this.course.courseMembership.name === 'Restricted') {
        this.course.courseMembership.key = "2";
      } else if (this.course.courseMembership.name === 'Private') {
        this.course.courseMembership.key = "3";
      }
    }
    this.course.r_domainToCourse_c_domainId = this.course.domain.id,
      this.course.r_sectorToCourse_c_sectorId = this.course.sector.id
    this.courseService.createCourse(this.course).subscribe({
      next: (data: Course) => {
        this.resetForm();
        this.refreshCourseList();
        alert('Course created successfully:');
        this.isAddMode = false;
        this.viewCourse = false;

      },
      error: (error) => {
        console.error('Error creating courses:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing sector fuctions
  editCourse(id: number) {
    this.isEditMode = true;
    this.course.id = id;
    this.courseService.findCourse(id).subscribe({
      next: (data: any) => {
        this.course.courseTitle = data.courseTitle;
        this.course.description = data.description;
        this.course.courseURL = data.courseURL;
        this.course.cPECredit = data.cPECredit;
        this.course.role = data.role;
        this.course.passingMarks = data.passingMarks;
        this.course.startDate = this.formatDate(data.startDate);
        this.course.endDate = this.formatDate(data.endDate);
        if (data.courseMembership) {
          this.course.courseMembership = data.courseMembership;
        }
        if (data.active) {
          this.course.active = data.active;
        }
        this.course.level = data.level;
        if (data.thumbnailImage) {
          this.courseService.getUploadedfile(this.course.thumbnailImage).subscribe({
            next: (imageData: any) => {
              this.course.thumbnailImage = imageData;
              if (this.course.thumbnailImage && this.course.thumbnailImage.fileName) {
                this.file = this.course.thumbnailImage.fileName;
              }
            },
            error: (error) => {
              console.error('Error fetching image data:', error);
            }
          });
        }
        if (data.r_domainToCourse_c_domainId) {
          this.course.domain.id = data.r_domainToCourse_c_domainId;
          this.domainService.findDomain(this.course.domain.id).subscribe({
            next: (data: any) => {
              this.course.domain.title = data.title;
            }
          });
        }
        if (data.r_sectorToCourse_c_sectorId) {
          this.course.sector.id = data.r_sectorToCourse_c_sectorId;
          this.sectorService.findSector(this.course.sector.id).subscribe({
            next: (data: any) => {
              this.course.sector.title = data.title;
              this.isloaded = true;
            }
          })
        }
      }
    })
  }
  updateCourse() {
    if (this.fileUpdated == true) {
      this.uploadImage();
    } else {
      this.updateCourseCall();
    }

  }

  updateCourseCall() {
    if (this.course.active) {
      this.course.active.key = this.course.active.name.toLowerCase();
    }
    if (this.course.level) {
      this.course.level.key = this.course.level.name.toLowerCase();
    }
    if (this.course.courseMembership.name) {
      if (this.course.courseMembership.name === 'Open') {
        this.course.courseMembership.key = "1";
      } else if (this.course.courseMembership.name === 'Restricted') {
        this.course.courseMembership.key = "2";
      } else if (this.course.courseMembership.name === 'Private') {
        this.course.courseMembership.key = "3";
      }
    }

    if (this.fileUpdated) {
      this.course.thumbnailImage = this.course.thumbnailImage
    } else {
      this.course.thumbnailImage = this.course.thumbnailImage.id
    }
    var course = {
      id: this.course.id,
      courseTitle: this.course.courseTitle,
      description: this.course.description,
      courseURL: this.course.courseURL,
      cPECredit: this.course.cPECredit,
      thumbnailImage: this.course.thumbnailImage,
      startDate: this.course.startDate,
      endDate: this.course.endDate,
      role: this.course.role,
      passingMarks: this.course.passingMarks,
      level: this.course.level,
      courseMembership: this.course.courseMembership,
      active: this.course.active,
      domain: this.course.domain,
      sector: this.course.sector,
      r_domainToCourse_c_domainId: this.course.domain.id,
      r_sectorToCourse_c_sectorId: this.course.sector.id
    }
    
    console.log(this.course)
    this.courseService.updateCourse(course).subscribe({
      next: (data: any) => {
        alert("Data updated successfully.");
        this.resetForm();
        this.refreshCourseList();
        this.isEditMode = false;
      }
    })
  }

  //View detail of sector function
  viewDetail(id: number) {
    this.navigateToLesson(id);
    console.log(id);
    this.viewCourse = true
    this.courseService.findCourse(id).subscribe({
      next: (data: any) => {
        this.courseData = data;
        this.courseData.startDate = this.formatDate (data.startDate);
        this.courseData.endDate = this.formatDate (data.endDate);
        this.courseData.dateCreated = this.formatDate (data.dateCreated);
        this.courseData.dateModified = this.formatDate (data.dateModified);
        if (data.r_domainToCourse_c_domainId) {
          this.domainService.findDomain(this.courseData.r_domainToCourse_c_domainId).subscribe({
            next: (domainData: any) => {
              this.domainData = domainData;
            }
          });
        }
        if (data.r_sectorToCourse_c_sectorId) {
          this.sectorService.findSector(this.courseData.r_sectorToCourse_c_sectorId).subscribe({
            next: (sectorData: any) => {
              this.sectorData = sectorData;
              this.isLoaded = true;
            }
          });
        }
      }
    })


    this.courseService.getAllLessonsByCourseId(id).subscribe({
      next:(response:any)=>{
        console.log("Lesson bu courseId not fetched");
        this.lessonData=response.items;
        console.log(JSON.stringify(this.lessonData));
      },
      error:(err:any)=>{
        console.log("Lesson bu courseId not fetched")
      }
      }
    )


  }

  openLesson() {
    this.router.navigate(['lesson']);
  }

  // Deleting sector data
  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Course deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting Course:', error);
      }
    });
  }

  refreshCourseList() {
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.courseData = response.items;
        this.courseData.forEach((course: Course) => {
          if (course.r_domainToCourse_c_domainId != 0) {
            const domainId = course.r_domainToCourse_c_domainId;
            this.domainService.findDomain(domainId).subscribe({
              next: (domainData: Domain) => {
                domainData = domainData;
              },
              error: (error: any) => {
                console.error('Error fetching course data:', error);
              }
            });
          }
          if (course.r_sectorToCourse_c_sectorId != 0) {
            const sectorId = course.r_sectorToCourse_c_sectorId;
            this.sectorService.findSector(sectorId).subscribe({
              next: (sectorData: Sector) => {
                sectorData = sectorData;
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
    })
  }

  ngOnInit(): void {
    this.refreshCourseList();
    this.picklistService.getMembershipData().subscribe(
      (response) => {
        this.membershipData = response.listTypeEntries;
      },
      (error) => {
        console.error('Error fetching picklist data:', error);
      })
    this.picklistService.getActiveData().subscribe({
      next: (response) => {
        this.activeData = response.listTypeEntries;
      }
    })
    this.picklistService.getDayData().subscribe({
      next: (response) => {
        this.dayData = response.listTypeEntries;
      }
    })

    this.picklistService.getLevelData().subscribe({
      next: (response) => {
        this.levelData = response.listTypeEntries;
      }
    })
    this.domainService.getAllDomains().subscribe({
      next: (response: any) => {
        this.domainData = response.items;
        this.domainData.forEach((domain: Domain) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching domains:', error);
      }
    });
    this.sectorService.getAllSectors().subscribe({
      next: (response: any) => {
        this.sectorData = response.items;
        this.sectorData.forEach((sector: Sector) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching course:', error);
      }
    });

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
    this.course = {
      id: 0,
      courseTitle: '',
      description: '',
      courseURL: '',
      cPECredit: '',
      thumbnailImage: '',
      startDate: new Date,
      endDate: new Date,
      role: '',
      passingMarks: '',
      r_domainToCourse_c_domainId: '',
      r_sectorToCourse_c_sectorId: '',
      level: {
        key: '',
        name: ''
      },
      courseMembership: {
        key: '',
        name: ''
      },
      active: {
        key: '',
        name: ''
      },
      domain: {
        id: 0,
        title: ''
      },
      sector: {
        id: 0,
        title: ''
      }
    }
  }


  createLesson() {
    if (this.lesson.active) {
      
      this.lesson.active.key = this.lesson.active.name.toLowerCase();
    }
    if (this.lesson.day) {
      this.lesson.day.key = this.lesson.day.name.toLowerCase();
      this.lesson.day.key = this.lesson.day.key.replace(/\s/g, '');
    }
    
    this.lesson.r_courseToLesson_c_courseId = this.courseToLessonId;
    this.lessonService.createLesson(this.lesson).subscribe({
      next: (data: Lesson) => {
        alert("Lesson created successfully")
        this.resetForm();
       
        this.isAddMode = false;
      },
      error: (error:any) => {
        console.error('Error creating Lesson:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }


  updateLesson() {
    if (this.lesson.active) {
      this.lesson.active.key = this.lesson.active.name.toLowerCase();
    }
    if (this.lesson.day) {
      this.lesson.day.key = this.lesson.day.name.toLowerCase();
      this.lesson.day.key = this.lesson.day.key.replace(/\s/g, '');
    }
    this.lesson.r_courseToLesson_c_courseId = this.lesson.course.id;
    var lesson = {
      id: this.lesson.id,
      r_courseToLesson_c_courseId: this.lesson.r_courseToLesson_c_courseId,
      sequenceNo: this.lesson.sequenceNo,
      lessonName: this.lesson.lessonName,
      summary: this.lesson.summary,
      completionTimeInHrs: this.lesson.completionTimeInHrs,
      active: this.lesson.active,
      day: this.lesson.day,
      course: {
        id: this.lesson.course.id,
        courseTitle: this.lesson.course.courseTitle,
      }
    }
    this.lessonService.updateLesson(lesson).subscribe({
      next: (data: any) => {
        alert("Data updated successfully.");
        this.resetForm();
      
        this.isEditMode = false;
      }
    })
  }

  addLesson(id:any){
    this.isAddLessonMode = true;
    this.courseToLessonId=id;
    this.viewCourse=false;
  }


  navigateToLesson(coursedId:any){

    this.courseService.setlessonByCourseId(coursedId);
    console.log("navigation course id"+coursedId);
  }


}






