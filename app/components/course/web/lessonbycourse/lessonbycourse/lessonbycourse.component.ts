import { Component, input } from '@angular/core';
import { CourseService } from '../../../service/course.service';
import { LessonService } from '../../../../lesson/service/lesson.service';
import { PicklistService } from '../../../../picklist-service/picklist.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { CourseInLesson, Lesson } from '../../../../lesson/model/lesson.model';
import { FormsModule } from '@angular/forms';
import { TopicbylessonComponent } from "../../../../lesson/web/topicbylesson/topicbylesson/topicbylesson.component";

@Component({
    selector: 'app-lessonbycourse',
    standalone: true,
    templateUrl: './lessonbycourse.component.html',
    styleUrl: './lessonbycourse.component.scss',
    imports: [NgFor, NgIf, FormsModule, TopicbylessonComponent]
})
export class LessonbycourseComponent {
  constructor(private courseService: CourseService,
    private lessonService: LessonService,
    private picklistService: PicklistService,
    private datePipe: DatePipe) { }

  //Variables
  isExtended: boolean = false;
  viewLesson: boolean = false;
  isloaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  courseData: any;
  course: CourseInLesson[] = [];
  activeData: any[] = [];
  dayData: any[] = [];
  lessonData: any;
  topicData:any;
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

  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //Add lesson
  addLesson() { this.isAddMode = true; }
  createLesson() {
    if (this.lesson.active) {
      this.lesson.active.key = this.lesson.active.name.toLowerCase();
    }
    if (this.lesson.day) {
      this.lesson.day.key = this.lesson.day.name.toLowerCase();
      this.lesson.day.key = this.lesson.day.key.replace(/\s/g, '');
    }
    this.lesson.r_courseToLesson_c_courseId = this.lesson.course.id;
    this.lessonService.createLesson(this.lesson).subscribe({
      next: (data: Lesson) => {
        alert("Lesson created successfully")
        this.resetForm();
        this.refreshLessonList();
        this.isAddMode = false;
      },
      error: (error) => {
        console.error('Error creating Lesson:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //update lesson 
  editLesson(id: number) {
    this.lesson.id = id;
    this.isEditMode = true;
    this.lessonService.findLesson(this.lesson.id).subscribe({
      next: (data: any) => {
        this.lesson.lessonName = data.lessonName;
        this.lesson.summary = data.summary;
        this.lesson.sequenceNo = data.sequenceNo;
        this.lesson.completionTimeInHrs = data.completionTimeInHrs;
        if (data.active) {
          this.lesson.active = data.active;
        }
        if (data.day) {
          this.lesson.day = data.day;
        }
        if (data.r_courseToLesson_c_courseId) {
          this.lesson.course.id = data.r_courseToLesson_c_courseId;
          this.courseService.findCourse(this.lesson.course.id).subscribe({
            next: (data: any) => {
              this.lesson.course.courseTitle = data.courseTitle;
            }
          })
        }
      }
    })
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
        this.refreshLessonList();
        this.isEditMode = false;
      }
    })
  }

  //view detail
  viewDetail(id: number) {
    this.viewLesson = true
    this.navigateToTopics(id);
    this.lessonService.findLesson(id).subscribe({
      next: (data: any) => {
        this.lessonData = data;
        this.lessonData.dateCreated = this.formatDate(data.dateCreated);
        this.lessonData.dateModified = this.formatDate(data.dateModified);
        if (data.r_courseToLesson_c_courseId) {
          this.courseService.findCourse(this.lessonData.r_courseToLesson_c_courseId).subscribe({
            next: (courseData: any) => {
              this.courseData = courseData;
              this.isloaded = true;
            }
          });
        }
      }
    })
    this.lessonService.getAllTopicsByLessonId(id).subscribe({
      next:(response:any)=>{
        console.log("topic with LessonId  fetched");
        this.topicData=response.items;
        console.log(JSON.stringify(this.topicData));
      },
      error:(err:any)=>{
        console.log("topic with lessonId not fetched")
      }
      }
    )



  }

  ngOnInit(): void {
    this.refreshLessonList();
    this.courseService.getAllCourses().subscribe({
      next: (data: any) => {
        this.course = data.items;
        this.course.forEach((course: CourseInLesson) => {
        });
      }
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
  }



  refreshLessonList() {
    const id=this.courseService.getlessonByCourseId();
    console.log("lessonto Course"+id);
    this.courseService.getAllLessonsByCourseId(id).subscribe({
      next: (response: any) => {
        this.lessonData = response.items;
        this.lessonData.forEach((lesson: Lesson) => {

          if (lesson.r_courseToLesson_c_courseId != 0) {
            const courseId = lesson.r_courseToLesson_c_courseId;
            this.courseService.findCourse(courseId).subscribe({
              next: (courseData: CourseInLesson) => {
                lesson.course = courseData;
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

  deleteLesson(id: number): void {
    this.lessonService.deleteLesson(id).subscribe({
      next: () => {
        alert('Lesson deleted successfully.');
        this.refreshPage()
        this.refreshLessonList();
      },
      error: (error: any) => {
        console.error('Error deleting Lesson:', error);
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
    this.lesson = {
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
  }
  navigateToTopics(lessonId:any){
    this.lessonService.setTopicByLessonId(lessonId);
    console.log("navigation course id"+lessonId);
  }
  
}
