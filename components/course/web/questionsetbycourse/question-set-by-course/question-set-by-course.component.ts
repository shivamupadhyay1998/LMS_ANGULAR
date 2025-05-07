import { Component } from '@angular/core';
import { QuestionSetService } from '../../../../questionSet/service/question-set.service';
import { CourseService } from '../../../service/course.service';
import { AssessmenttypeService } from '../../../../assessmenttype/service/assessmenttype.service';
import { AssessmentlevelService } from '../../../../assessmentlevel/service/assessmentlevel.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AssessmentLevelInQuestionSet, AssessmentTypeInQuestionSet, CourseInQuestionSet, QuestionSet } from '../../../../questionSet/model/questionSet.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-set-by-course',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './question-set-by-course.component.html',
  styleUrl: './question-set-by-course.component.scss'
})
export class QuestionSetByCourseComponent {

  constructor(private questionSetService: QuestionSetService,
    private courseService: CourseService,
    private assessmentTypeService: AssessmenttypeService,
    private assessmentLevelService: AssessmentlevelService,
    private datePipe: DatePipe) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewQuestionSet: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  questionSetData: any;
  courseData: any;
  assessmentTypeData: any;
  assessmentLevelData: any;
  questionSet: QuestionSet = {
    id: 0,
    title: '',
    r_courseToQuestionSet_c_courseId: '',
    r_assessmentTypeToQuestionSet_c_assessmentTypeId: '',
    r_assessmentLevelToQuestionSet_c_assessmentLevelId: '',
    course: {
      id: 0,
      courseTitle: ''
    },
    assessmentType: {
      id: 0,
      typeName: ''
    },
    assessmentLevel: {
      id: 0,
      title: ''
    }
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
    if (this.viewQuestionSet) { 
      this.questionSetData = '';
      this.viewQuestionSet = false;
      this.refreshQuestionSetList()
    }
  }

  //Creating questionSet functions
  addQuestionSet() { this.isAddMode = true }
  createQuestionSet() {
    this.questionSet.r_courseToQuestionSet_c_courseId = this.questionSet.course.id;
    this.questionSet.r_assessmentTypeToQuestionSet_c_assessmentTypeId = this.questionSet.assessmentType.id;
    this.questionSet.r_assessmentLevelToQuestionSet_c_assessmentLevelId = this.questionSet.assessmentLevel.id;
    this.questionSetService.createQuestionSet(this.questionSet).subscribe({
      next: (data: QuestionSet) => {
        this.refreshPage();
        alert('Question Set created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewQuestionSet = false;

      },
      error: (error) => {
        console.error('Error creating question Sets:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing questionSet fuctions
  editQuestionSet(id: number) {
    this.isEditMode = true;
    this.questionSet.id = id;
    this.questionSetService.findQuestionSet(this.questionSet.id).subscribe({
      next: (data: any) => {
        this.questionSet.title = data.title;
        if (data.r_courseToQuestionSet_c_courseId) {
          this.questionSet.course.id = data.r_courseToQuestionSet_c_courseId;
          this.courseService.findCourse(this.questionSet.course.id).subscribe({
            next: (data: any) => {
              this.questionSet.course.courseTitle = data.courseTitle;
            },
            error: (error: any) => {
              console.error('Error fetching course data:', error);
            }
          });
        }
        if (data.r_assessmentTypeToQuestionSet_c_assessmentTypeId) {
          this.questionSet.assessmentType.id = data.r_assessmentTypeToQuestionSet_c_assessmentTypeId;
          this.assessmentTypeService.findAssessmentType(this.questionSet.assessmentType.id).subscribe({
            next: (data: any) => {
              this.questionSet.assessmentType.typeName = data.typeName;
            },
            error: (error: any) => {
              console.error('Error fetching assessment type data:', error);
            }
          });
        }
        if (data.r_assessmentLevelToQuestionSet_c_assessmentLevelId) {
          this.questionSet.assessmentLevel.id = data.r_assessmentLevelToQuestionSet_c_assessmentLevelId;
          this.assessmentLevelService.findAssessmentLevel(this.questionSet.assessmentLevel.id).subscribe({
            next: (data: any) => {
              this.questionSet.assessmentLevel.title = data.title;
            },
            error: (error: any) => {
              console.error('Error fetching assessment level data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching question Set data:', error);
      }
    });
  }
  updateQuestionSet() {
    this.questionSet.r_courseToQuestionSet_c_courseId = this.questionSet.course.id;
    this.questionSet.r_assessmentTypeToQuestionSet_c_assessmentTypeId = this.questionSet.assessmentType.id;
    this.questionSet.r_assessmentLevelToQuestionSet_c_assessmentLevelId = this.questionSet.assessmentLevel.id;
    var questionSet = {
      id: this.questionSet.id,
      title: this.questionSet.title,
      r_courseToQuestionSet_c_courseId: this.questionSet.r_courseToQuestionSet_c_courseId,
      r_assessmentTypeToQuestionSet_c_assessmentTypeId: this.questionSet.r_assessmentTypeToQuestionSet_c_assessmentTypeId,
      r_assessmentLevelToQuestionSet_c_assessmentLevelId: this.questionSet.r_assessmentLevelToQuestionSet_c_assessmentLevelId,
      course: {
        id: this.questionSet.course.id,
        courseTitle: this.questionSet.course.courseTitle,
      },
      assessmentType: {
        id: this.questionSet.assessmentType.id,
        typeName: this.questionSet.assessmentType.typeName
      },
      assessmentLevel: {
        id: this.questionSet.assessmentLevel.id,
        title: this.questionSet.assessmentLevel.title
      }
    }
    this.questionSetService.updateQuestionSet(questionSet).subscribe({
      next: (updatedData: any) => {
        this.refreshQuestionSetList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of questionSet function
  viewDetail(id: number) {
    this.viewQuestionSet = true
    this.questionSetService.findQuestionSet(id).subscribe({
      next: (data: any) => {
        this.questionSetData = data;
        this.questionSetData.dateCreated = this.formatDate(data.dateCreated);
        this.questionSetData.dateModified = this.formatDate(data.dateModified);
        if (data.r_courseToQuestionSet_c_courseId) {
          this.courseService.findCourse(data.r_courseToQuestionSet_c_courseId).subscribe({
            next: (data: any) => {
              this.courseData = data;
            },
            error: (error: any) => {
              console.error('Error fetching course data:', error);
            }
          });
        }
        if (data.r_assessmentTypeToQuestionSet_c_assessmentTypeId) {
          this.assessmentTypeService.findAssessmentType(data.r_assessmentTypeToQuestionSet_c_assessmentTypeId).subscribe({
            next: (data: any) => {
              this.assessmentTypeData = data;
            },
            error: (error: any) => {
              console.error('Error fetching assessment type data:', error);
            }
          });
        }
        if (data.r_assessmentLevelToQuestionSet_c_assessmentLevelId) {
          this.assessmentLevelService.findAssessmentLevel(data.r_assessmentLevelToQuestionSet_c_assessmentLevelId).subscribe({
            next: (data: any) => {
              this.assessmentLevelData = data;
              this.isloaded = true;
            },
            error: (error: any) => {
              console.error('Error fetching assessment level data:', error);
            }
          });
        }
      }
    })
  }

  // Deleting questionSet data
  deleteQuestionSet(id: number): void {
    this.questionSetService.deleteQuestionSet(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('QuestionSet deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting questionSet:', error);
      }
    });
  }

  //Get all questionSet list
  refreshQuestionSetList() {
    //get all questionSets data for list view
    const id=this.courseService.getQuestionSetByCourseId();
    this.courseService.getAllQuestionSetByCourseId(id).subscribe({
      next: (response: any) => {
        this.questionSetData = response.items;
        this.questionSetData.forEach((questionSet: QuestionSet) => {
          if (questionSet.r_courseToQuestionSet_c_courseId != 0) {
            this.courseService.findCourse(questionSet.r_courseToQuestionSet_c_courseId).subscribe({
              next: (data: any) => {
                questionSet.course = data;
              },
              error: (error: any) => {
                console.error('Error fetching course data:', error);
              }
            });
          }
          if (questionSet.r_assessmentTypeToQuestionSet_c_assessmentTypeId != 0) {
            this.assessmentTypeService.findAssessmentType(questionSet.r_assessmentTypeToQuestionSet_c_assessmentTypeId).subscribe({
              next: (data: any) => {
                questionSet.assessmentType = data;
              },
              error: (error: any) => {
                console.error('Error fetching assessmentType data:', error);
              }
            });
          }
          if (questionSet.r_assessmentLevelToQuestionSet_c_assessmentLevelId != 0) {
            this.assessmentLevelService.findAssessmentLevel(questionSet.r_assessmentLevelToQuestionSet_c_assessmentLevelId).subscribe({
              next: (data: any) => {
                questionSet.assessmentLevel = data;
              },
              error: (error: any) => {
                console.error('Error fetching assessmentLevel data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.questionSet = {
      id: 0,
      title: '',
      r_courseToQuestionSet_c_courseId: '',
      r_assessmentTypeToQuestionSet_c_assessmentTypeId: '',
      r_assessmentLevelToQuestionSet_c_assessmentLevelId: '',
      course: {
        id: 0,
        courseTitle: ''
      },
      assessmentType: {
        id: 0,
        typeName: ''
      },
      assessmentLevel: {
        id: 0,
        title: ''
      }
    }
  }

  ngOnInit(): void {
    //get questionSet list on page load
    this.refreshQuestionSetList();
    //get all course data in questionSets for the dropdown
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.courseData = response.items;
        this.courseData.forEach((course: CourseInQuestionSet) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
      }
    });

    //get all assessmentLevel data in questionSets for the dropdown
    this.assessmentLevelService.getAllAssessmentLevels().subscribe({
      next: (response: any) => {
        this.assessmentLevelData = response.items;
        this.assessmentLevelData.forEach((assessmentLevel: AssessmentLevelInQuestionSet) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching assessmentLevelData:', error);
      }
    });

    //get all course data in questionSets for the dropdown
    this.assessmentTypeService.getAllAssessmentTypes().subscribe({
      next: (response: any) => {
        this.assessmentTypeData = response.items;
        this.assessmentTypeData.forEach((assessmentType: AssessmentTypeInQuestionSet) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching courses:', error);
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

 
}

