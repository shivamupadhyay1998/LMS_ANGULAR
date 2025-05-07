import { Component, OnInit } from '@angular/core';
import { LessonSkillSet } from '../model/lessonskillset.model';
import { SkillService } from '../../skill/service/skill.service';
import { Skill } from '../../skill/model/skill.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lessionskillsetservice } from '../service/lessonskillset.service';
import { LessonService } from '../../lesson/service/lesson.service';
import { Lesson } from '../../lesson/model/lesson.model';

@Component({
  selector: 'app-lessonskillset',
  standalone: true,
  imports: [NgIf,NgFor,FormsModule],
  templateUrl: './lessonskillset.component.html',
  styleUrl: './lessonskillset.component.scss'
})
export class LessonskillsetComponent implements OnInit {

  constructor(private lessionskillsetservice: lessionskillsetservice, 
    private skillService : SkillService,
    private lessonService : LessonService,
   ) { }

  //Variables
  isloaded: boolean = false;
  isExtended: boolean = false;
  viewLessonSkillSet: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  lessonskillsetData: any;
  skillData: any;
  lessonData:any;

  lessonskillset: LessonSkillSet ={
    id: 0,
    name: '',
    skill: {
      id: 0,
      name: ''
    },
    r_skillToLessonSkillSet_c_skillId: '',
    r_lessonToLessonSkillSet_c_lessonId: '',
    lesson: {
      id: 0,
      lessonName: ''
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
    if (this.viewLessonSkillSet) { 
      this.lessonskillsetData = '';
      this.viewLessonSkillSet = false;
      this.refreshLessonSkillSetList()
    }
  }

  //To call the create lessonskillset form
  addLessonSkillSet() { this.isAddMode = true }

  //Creating lessonskillset
  createLessonSkillSet() {
    this.lessonskillset.r_skillToLessonSkillSet_c_skillId = this.lessonskillset.skill.id;
    this.lessonskillset.r_lessonToLessonSkillSet_c_lessonId = this.lessonskillset.lesson.id;
    this.lessionskillsetservice.createLessonSkillSet(this.lessonskillset).subscribe({
      next: (data: LessonSkillSet) => {
        this.refreshLessonSkillSetList();
        alert('LessonSkillSet created successfully:');
        this.resetForm();
        this.isAddMode = false;
        this.viewLessonSkillSet = false;

      },
      error: (error) => {
        console.error('Error creating lessionskillsets:', error);
      },
    });
  }

  //Editing lessonskillset fuctions
  editLessonSkillSet(id: number) {
    this.lessonskillset.id = id;
    this.isEditMode = true;
    this.lessionskillsetservice.findLessonSkillSet(id).subscribe({
      next: (data: any) => {
        this.lessonskillset.name = data.name;
        if (data.r_skillToLessonSkillSet_c_skillId) {
          this.lessonskillset.skill.id = data.r_skillToLessonSkillSet_c_skillId;
          this.skillService.findSkill(this.lessonskillset.skill.id).subscribe({
            next: (skillData: any) => {
              this.lessonskillset.skill.name = skillData.name;
            }
            
          });
        }
        if (data.r_lessionToLessionSkillSet_c_lessonId) {
          this.lessonskillset.lesson.id = data.r_lessionToLessionSkillSet_c_lessonId;
          this.lessonService.findLesson(this.lessonskillset.lesson.id).subscribe({
            next: (lessonData: any) => {
              this.lessonskillset.lesson.lessonName = lessonData.lessonName;
            }
          })
        }
      }
    })
  }
  updateLessonSkillSet() {
    var lessonskillset = {
      id: this.lessonskillset.id,
      name: this.lessonskillset.name,
      skill: this.lessonskillset.skill,
      lesson: this.lessonskillset.lesson,
      r_skillToLessonSkillSet_c_skillId: this.lessonskillset.skill.id,
      r_lessonToLessonSkillSet_c_lessonId : this.lessonskillset.lesson.id,
      
    }
    this.lessionskillsetservice.updateLessonSkillSet(lessonskillset).subscribe({
      next: (updatedData: any) => {
        this.refreshLessonSkillSetList();
        alert("Data updated successfully")
        this.resetForm();
        this.isEditMode = false;
      }
    })
  }

  //View detail of lessonskillset function
  viewDetail(id: number) {
    this.viewLessonSkillSet = true
    this.lessionskillsetservice.findLessonSkillSet(id).subscribe({
      next: (data: any) => {
        this.lessonskillsetData = data;
        this.skillService.findSkill(this.lessonskillsetData.r_skillToLessonSkillSet_c_skillId).subscribe({
          next: (data: any) => {
            this.skillData = data;
            this.isloaded = true;
          }
        })
      }
    })
  }

  // Deleting lessonskillset data
  deleteLessonSkillSet(id: number): void {
    this.lessionskillsetservice.deleteLessonSkillSet(id).subscribe({
      next: () => {
        this.refreshPage()
        alert('Lesson Skill Set deleted successfully.');
      },
      error: (error: any) => {
        console.error('Error deleting lesson skill set:', error);
      }
    });
  }

  //Get all sector list
  refreshLessonSkillSetList() {
    //get all sectors data for list view
    this.lessionskillsetservice.getAllLessionSkillSets().subscribe({
      next: (response: any) => {
        this.lessonskillsetData = response.items;
        this.lessonskillsetData.forEach((lessonskillset: LessonSkillSet) => {
          if (lessonskillset.r_skillToLessonSkillSet_c_skillId != 0) {
            const r_skillToLessonSkillSet_c_skillId = lessonskillset.r_skillToLessonSkillSet_c_skillId;
            this.skillService.findSkill(r_skillToLessonSkillSet_c_skillId).subscribe({
              next: (skillData: any) => {
                lessonskillset.skill = skillData;
              },
              error: (error: any) => {
                console.error('Error fetching lessonskillset data:', error);
              }
            });
          }
          if (lessonskillset.r_lessonToLessonSkillSet_c_lessonId != 0) {
            const r_lessionToLessionSkillSet_c_lessonId = lessonskillset.r_lessonToLessonSkillSet_c_lessonId;
            this.lessonService.findLesson(r_lessionToLessionSkillSet_c_lessonId).subscribe({
              next: (lessonData: any) => {
                lessonskillset.lesson = lessonData;
              }
            });
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching course:', error);
      }
    })
    this.isLoaded = true;
  }

  //reset form fields
  resetForm() {
    this.lessonskillset = {
      id: 0,
      name: '',
      r_skillToLessonSkillSet_c_skillId: '',
      r_lessonToLessonSkillSet_c_lessonId: '',
      skill: {
        id: 0,
        name: ''
      },
      lesson: {
        id: 0,
        lessonName: ''
      }
    }
  }

  ngOnInit(): void {
    //get sector list on page load
    this.refreshLessonSkillSetList();
    
    //get all domains data in sectors for the dropdown
    this.skillService.getAllSkills().subscribe({
      next: (response: any) => {
        this.skillData = response.items;
        this.skillData.forEach((skill: Skill) => {
        });
      },
      error: (error: any) => {
        console.error('Error fetching countries:', error);
      }
      
    });

    this.lessonService.getAllLessons().subscribe({
      next: (response: any) => {
        this.lessonData = response.items;
        this.lessonData.forEach((lesson: Lesson) => {
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
