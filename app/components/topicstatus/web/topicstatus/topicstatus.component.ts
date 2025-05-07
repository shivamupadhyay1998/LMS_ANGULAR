import { Component, OnInit } from '@angular/core';
import { TopicstatusService } from '../../service/topicstatus.service';
import { DomainService } from '../../../domain/service/domain.service';
import { Topicstatus } from '../../model/topicstatus.model';
import { TopicService } from '../../../topic/service/topic.service';
import { CourseService } from '../../../course/service/course.service';
import { LessonService } from '../../../lesson/service/lesson.service';
import { Course } from '../../../course/model/course.model';
import { Lesson } from '../../../lesson/model/lesson.model';
import { Topic } from '../../../topic/model/topic.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PicklistService } from '../../../picklist-service/picklist.service';


@Component({
  selector: 'app-topicstatus',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './topicstatus.component.html',
  styleUrl: './topicstatus.component.scss'
})
export class TopicstatusComponent implements OnInit {

  constructor(private topicstatusService: TopicstatusService,
    private topicService: TopicService,private lessonService: LessonService , private courseService: CourseService, private picklistService:PicklistService) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewTopicstatus: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  topicstatusData: any;
  topicData: any;
  lessonData: any;
  courseData: any;
  completedData: any[] = [];
  topicstatus: Topicstatus = {
    id: 0,
    name: '',
    completionTime: '',
    timeSpent: '',
    completed:{
     key:'',
     name:''
    },
    videoTime: '',
    r_topicToTopicStatus_c_topicId: 0,
    r_lesssonToTopicStatus_c_lessonId: 0,
    r_courseToTopicStatus_c_courseId: 0,
    topic: {
      id: 0,
      topicName: '',
    },
    lesson: {
      id: 0,
      lessonName: '',
    },
    course: {
      id: 0,
      courseTitle: '',
    },
    
    
  }

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  //Creating topicstatus functions
  addTopicstatus() { this.isAddMode = true }
  createTopicstatus() {
    this.topicstatus.r_topicToTopicStatus_c_topicId = this.topicstatus.topic.id;
    this.topicstatus.r_lesssonToTopicStatus_c_lessonId = this.topicstatus.lesson.id;
    this.topicstatus.r_courseToTopicStatus_c_courseId = this.topicstatus.course.id;
    if (this.topicstatus.completed) {
      this.topicstatus.completed.key = this.topicstatus.completed.name.toLowerCase();
    }
    this.topicstatusService.createTopicstatus(this.topicstatus).subscribe({
      next: (data: Topicstatus) => {
        this.refreshPage();
        alert('Topicstatus created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewTopicstatus = false;

      },
      error: (error) => {
        console.error('Error creating topicstatuss:', error);
        // Handle the error (e.g., show a user-friendly message)
      },
    });
  }

  //Editing topicstatus fuctions
  editTopicstatus(id: number) {
    this.isEditMode = true;
    this.topicstatus.id = id;
    this.topicstatusService.findTopicstatus(this.topicstatus.id).subscribe({
      next: (data: any) => {
        this.topicstatus.name = data.name;
        this.topicstatus.completionTime = data.completionTime;
        this.topicstatus.timeSpent = data.timeSpent;
        this.topicstatus.videoTime = data.videoTime;
        if (data.completed) {
          this.topicstatus.completed = data.completed;
        }
        if (data.r_topicToTopicStatus_c_topicId) {
          this.topicstatus.r_topicToTopicStatus_c_topicId = data.r_topicToTopicStatus_c_topicId;
          this.topicService.findTopic(this.topicstatus.r_topicToTopicStatus_c_topicId).subscribe({
            next: (topicData: any) => {
              this.topicstatus.topic.id = topicData.id;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
        if (data.r_lesssonToTopicStatus_c_lessonId) {
          this.topicstatus.r_lesssonToTopicStatus_c_lessonId = data.r_lesssonToTopicStatus_c_lessonId;
          this.lessonService.findLesson(this.topicstatus.r_lesssonToTopicStatus_c_lessonId).subscribe({
            next: (lessonData: any) => {
              this.topicstatus.lesson.id = lessonData.id;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
        if (data.r_courseToTopicStatus_c_courseId) {
          this.topicstatus.r_courseToTopicStatus_c_courseId = data.r_courseToTopicStatus_c_courseId;
          this.courseService.findCourse(this.topicstatus.r_courseToTopicStatus_c_courseId).subscribe({
            next: (courseData: any) => {
              this.topicstatus.course.id = courseData.id;
            },
            error: (error: any) => {
              console.error('Error fetching domain data:', error);
            }
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching topicstatus data:', error);
      }
    });
  }
  updateTopicstatus() {
   this.topicstatus.r_topicToTopicStatus_c_topicId = this.topicstatus.topic.id;
   this.topicstatus.r_lesssonToTopicStatus_c_lessonId = this.topicstatus.lesson.id;
   this.topicstatus.r_courseToTopicStatus_c_courseId = this.topicstatus.course.id;
   

    this.topicstatusService.updateTopicstatus(this.topicstatus).subscribe({
      next: (updatedData: any) => {
        this.refreshTopicstatusList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of topicstatus function
  viewDetail(id: number) {
    this.viewTopicstatus = true
    this.topicstatusService.findTopicstatus(id).subscribe({
      next: (data: any) => {
        this.topicstatusData = data;
        this.topicService.findTopic(this.topicstatusData.r_topicToTopicStatus_c_topicId).subscribe({
          next: (data: any) => {
            this.topicData = data;
            this.isloaded = true;
          }
        })
        this.lessonService.findLesson(this.topicstatusData.r_lesssonToTopicStatus_c_lessonId).subscribe({
          next: (data: any) => {
            this.lessonData = data;
            this.isloaded = true;
          }
        })
        this.courseService.findCourse(this.topicstatusData.r_courseToTopicStatus_c_courseId).subscribe({
          next: (data: any) => {
            this.courseData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting topicstatus data
  deleteTopicstatus(id: number): void {
    this.topicstatusService.deleteTopicstatus(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Topicstatus deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting topicstatus:', error);
      }
    });
  }

  //Get all topicstatus list
  refreshTopicstatusList() {
    //get all topicstatuss data for list view
    this.topicstatusService.getAllTopicstatuss().subscribe({
      next: (response: any) => {
        this.topicstatusData = response.items;
        
        this.topicstatusData.forEach((topicstatus: Topicstatus) => {
          if (topicstatus.r_topicToTopicStatus_c_topicId != 0) {
            const rTopicCTopicId = topicstatus.r_topicToTopicStatus_c_topicId;
            console.log("topic rid title="+JSON.stringify(rTopicCTopicId));
            this.topicService.findTopic(rTopicCTopicId).subscribe({
              next: (topicData: any) => {
                topicstatus.topic= topicData;
             
                console.log("topic title="+JSON.stringify(topicstatus.topic.topicName));
               
              },
              error: (error: any) => {
                console.error('Error fetching topic data:', error);
              }
            });
          }
          if (topicstatus.r_lesssonToTopicStatus_c_lessonId != 0) {
            const rLessonCLessonId = topicstatus.r_lesssonToTopicStatus_c_lessonId;
            this.lessonService.findLesson(rLessonCLessonId).subscribe({
              next: (lessonData: any) => {
                topicstatus.lesson = lessonData;
              },
              error: (error: any) => {
                console.error('Error fetching lessons data:', error);
              }
            });
          }
          if (topicstatus.r_courseToTopicStatus_c_courseId != 0) {
            const rCourseCCourseId = topicstatus.r_courseToTopicStatus_c_courseId;
            this.courseService.findCourse(rCourseCCourseId).subscribe({
              next: (courseData: any) => {
                topicstatus.course = courseData;
                console.log("topic title="+JSON.stringify(topicstatus.course.courseTitle));
              },
              error: (error: any) => {
                console.error('Error fetching topicstatus data:', error);
              }
            });
          }
        });
      }
    })
  }

  //reset form fields
  resetForm() {
    this.topicstatus = {
      id:0,
      name:'',
      completionTime:'',
      timeSpent: '',
      completed:{
        key:'',
        name:''
       },
      videoTime:'',
      r_topicToTopicStatus_c_topicId:0,
      r_lesssonToTopicStatus_c_lessonId:0,
      r_courseToTopicStatus_c_courseId:0,
      topic: {
        id: 0,
        topicName: '',
      },
      lesson: {
        id: 0,
        lessonName: '',
      },
      course: {
        id: 0,
        courseTitle: '',
      },
    }
  }

  ngOnInit(): void {
    //get topicstatus list on page load
    this.refreshTopicstatusList();

    this.picklistService.getActiveData().subscribe({
      next: (response) => {
        this.completedData = response.listTypeEntries;
      }
    })
    //get all domains data in topicstatuss for the dropdown
    this.courseService.getAllCourses().subscribe({
      next: (response: any) => {
        this.courseData = response.items;
        this.courseData.forEach((course: Course) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching topicstatuss:', error);
      }
    });
    this.lessonService.getAllLessons().subscribe({
      next: (response: any) => {
        this.lessonData = response.items;
        this.lessonData.forEach((lesson: Lesson) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching topicstatuss:', error);
      }
    });
    this.topicService.getAllTopic().subscribe({
      next: (response: any) => {
        this.topicData = response.items;
        this.topicData.forEach((topic: Topic) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching topicstatuss:', error);
      }
    });
  }

  refreshPage() {
    window.location.reload();
  }
}
