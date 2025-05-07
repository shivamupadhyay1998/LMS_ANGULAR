import { Component } from '@angular/core';
import { CourseService } from '../../course/service/course.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Assessment, AssessmentLevelInAssessment, CourseInAssessment } from '../../assessment/model/assessment.model';
import { PicklistService } from '../../picklist-service/picklist.service';
import { AssessmentService } from '../service/assessment.service';
import { AssessmentlevelService } from '../../assessmentlevel/service/assessmentlevel.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule ],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.scss'
})
export class AssessmentComponent {
  constructor(private assessmentService: AssessmentService,
    private assessmentlevelService: AssessmentlevelService,
    private courseService: CourseService,
    private picklistService: PicklistService,
    private datePipe: DatePipe) { }

  //Variables
  isExtended: boolean = false;
  viewAssessment: boolean = false;
  isloaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  courseData: any;
  course: CourseInAssessment[] = [];
  testTypeData: any[] = [];
  assessmentLevel: any[]=[];
  noOfQuestionsPerAssessmentData: any[] = [];
  assessmentData: any;
  topicData:any;
  assessment: Assessment = {
    id: 0,
    r_courseToAssessment_c_courseId: '',
    r_assessmentLevelToAssessment_c_assessmentLevelId:'',
   
    testType: {
      key: '',
      name: ''
    },
    assessmentLevel: {
      id: 0,
      title: '',
    },
    course: {
      id: 0,
      courseTitle: '',
    },
    noOfQuestionsPerLesson: {
      key: '',
      name: ''
    },
  }

  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //Add assessment
  addAssessment() { this.isAddMode = true; }
  createAssessment() {
    if (this.assessment.testType) {
      console.log("hiiiii"+this.assessment.assessmentLevel.title);

      this.assessment.testType.key = this.assessment.testType.name.charAt(0).toLowerCase()+this.assessment.testType.name.slice(1).toUpperCase();

    }
    if (this.assessment.noOfQuestionsPerLesson) {
      
      this.assessment.noOfQuestionsPerLesson.key = this.assessment.noOfQuestionsPerLesson.name.toLowerCase();
      this.assessment.noOfQuestionsPerLesson.key = this.assessment.noOfQuestionsPerLesson.key.replace(/\s/g, '');
    }
    this.assessment.r_assessmentLevelToAssessment_c_assessmentLevelId=this.assessment.assessmentLevel.id
    this.assessment.r_courseToAssessment_c_courseId = this.assessment.course.id;
    this.assessmentService.createAssessment(this.assessment).subscribe({
      next: (data: Assessment) => {
        alert("Assessment created successfully")
        this.resetForm();
        this.refreshAssessmentList();
        this.isAddMode = false;
      },
      error: (error) => {
        console.error('Error creating Assessment:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //update assessment 
  editAssessment(id: number) {
    this.assessment.id = id;
    this.isEditMode = true;
    this.assessment.testType.key = this.assessment.testType.name.charAt(0).toLowerCase()+this.assessment.testType.name.slice(1).toUpperCase();

    this.assessmentService.findAssessment(this.assessment.id).subscribe({
      next: (data: any) => {
        if (data.testType) {
          this.assessment.testType = data.testType;
        }
        if (data.noOfQuestionsPerLesson) {
          this.assessment.noOfQuestionsPerLesson = data.noOfQuestionsPerLesson;
        }
        if (data.r_assessmentLevelToAssessment_c_assessmentLevelId) {
          this.assessment.assessmentLevel.id = data.r_assessmentLevelToAssessment_c_assessmentLevelId;
          this.assessmentlevelService.findAssessmentLevel(this.assessment.assessmentLevel.id).subscribe({
            next: (data: any) => {
              this.assessment.assessmentLevel.title = data.title;
            }
          })
        }
        if (data.r_courseToAssessment_c_courseId) {
          this.assessment.course.id = data.r_courseToAssessment_c_courseId;
          this.courseService.findCourse(this.assessment.course.id).subscribe({
            next: (data: any) => {
              this.assessment.course.courseTitle = data.courseTitle;
            }
          })
        }
      }
    })
  }

  updateAssessment() {
    if (this.assessment.testType) {
      this.assessment.testType.key = this.assessment.testType.name.charAt(0).toLowerCase()+this.assessment.testType.name.slice(1).toUpperCase();
    }
    if (this.assessment.noOfQuestionsPerLesson) {
      this.assessment.noOfQuestionsPerLesson.key = this.assessment.noOfQuestionsPerLesson.name.toLowerCase();
      this.assessment.noOfQuestionsPerLesson.key = this.assessment.noOfQuestionsPerLesson.key.replace(/\s/g, '');
    }
    this.assessment.r_assessmentLevelToAssessment_c_assessmentLevelId = this.assessment.assessmentLevel.id;
    this.assessment.r_courseToAssessment_c_courseId = this.assessment.course.id;
    var assessment = {
      id: this.assessment.id,
      r_assessmentLevelToAssessment_c_assessmentLevelId: this.assessment.r_assessmentLevelToAssessment_c_assessmentLevelId,
      r_courseToAssessment_c_courseId: this.assessment.r_courseToAssessment_c_courseId,
     
      testType: this.assessment.testType,
      noOfQuestionsPerLesson: this.assessment.noOfQuestionsPerLesson,
      assessmentLevel: {
        id: this.assessment.assessmentLevel.id,
        title: this.assessment.assessmentLevel.title,
      },
      course: {
        id: this.assessment.course.id,
        courseTitle: this.assessment.course.courseTitle,
      }
    }
    this.assessmentService.updateAssessment(assessment).subscribe({
      next: (data: any) => {
        alert("Data updated successfully.");
        this.resetForm();
        this.refreshAssessmentList();
        this.isEditMode = false;
      }
    })
  }

  //view detail
  viewDetail(id: number) {
    this.viewAssessment = true
    this.assessmentService.findAssessment(id).subscribe({
      next: (data: any) => {
        this.assessmentData = data;
        this.assessmentData.dateCreated = this.formatDate(data.dateCreated);
        this.assessmentData.dateModified = this.formatDate(data.dateModified);

        if (data.r_assessmentLevelToAssessment_c_assessmentLevelId) {
          this.assessmentlevelService.findAssessmentLevel(this.assessmentData.r_assessmentLevelToAssessment_c_assessmentLevelId).subscribe({
            next: (assessmentData: any) => {
              this.assessmentData = assessmentData;
              this.isloaded = true;
            }
          });
        }
        if (data.r_courseToAssessment_c_courseId) {
          this.courseService.findCourse(this.assessmentData.r_courseToAssessment_c_courseId).subscribe({
            next: (courseData: any) => {
              this.courseData = courseData;
              this.isloaded = true;
            }
          });
        }

      }
    })
    this.assessmentService.getAllAssessments().subscribe({
      next:(response:any)=>{
        //console.log("topic with AssessmentId  fetched");
        this.assessmentData=response.items;
        console.log(JSON.stringify(this.assessmentData));
      },
      error:(err:any)=>{
        console.log("topic with assessmentId not fetched")
      }
      }
    )



  }

  ngOnInit(): void {
    this.refreshAssessmentList();
    this.courseService.getAllCourses().subscribe({
      next: (data: any) => {
        this.course = data.items;
        this.course.forEach((course: CourseInAssessment) => {
        });
      }
    })
    this.assessmentlevelService.getAllAssessmentLevels().subscribe({
      next: (data: any) => {
        this.assessmentLevel = data.items;
        this.assessmentLevel.forEach((assessmentLevel: AssessmentLevelInAssessment) => {
        });
      }
    })


    this.picklistService.getTestTypeData().subscribe({
      next: (response) => {
        this.testTypeData = response.listTypeEntries;
      }
    })

    this.picklistService.getNoOfQuestionsPerLesson().subscribe({
      next: (response) => {
        this.noOfQuestionsPerAssessmentData = response.listTypeEntries;
      }
    })
  }

  refreshAssessmentList() {
    this.assessmentService.getAllAssessments().subscribe({
      next: (response: any) => {
        this.assessmentData = response.items;
        this.assessmentData.forEach((assessment: Assessment) => {

          if (assessment.r_courseToAssessment_c_courseId != 0) {
            const courseId = assessment.r_courseToAssessment_c_courseId;
            const assessmentLevelId = assessment.r_assessmentLevelToAssessment_c_assessmentLevelId;

            this.courseService.findCourse(courseId).subscribe({
              next: (courseData: CourseInAssessment) => {
                assessment.course = courseData;
              },
              error: (error: any) => {
                console.error('Error fetching course data:', error);
              }
            });
            this.assessmentlevelService.findAssessmentLevel(assessmentLevelId).subscribe({
              next: (assessmentData: AssessmentLevelInAssessment) => {
                assessment.assessmentLevel = assessmentData;
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

  deleteAssessment(id: number): void {
    this.assessmentService.deleteAssessment(id).subscribe({
      next: () => {
        alert('Assessment deleted successfully.');
        this.refreshPage()
        this.refreshAssessmentList();
      },
      error: (error: any) => {
        console.error('Error deleting Assessment:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }

  formattedDate: any;
  formatDate(_date: Date) {
    this.formattedDate = this.datePipe.transform(_date, 'dd-MM-YYYY');
    return this.formattedDate;
  }

  resetForm() {
    this.assessment = {
      id: 0,
      r_courseToAssessment_c_courseId: '',
      r_assessmentLevelToAssessment_c_assessmentLevelId: '',
      testType: {
        key: '',
        name: ''
      },
      course: {
        id: 0,
        courseTitle: '',
      },
      assessmentLevel: {
        id: 0,
        title: '',
      },
      noOfQuestionsPerLesson: {
        key: '',
        name: ''
      },
    }
  }


  
}
