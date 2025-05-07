import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Skill } from '../../model/skill.model';
import { SkillService } from '../../service/skill.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-skill',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './skill.component.html',
  styleUrl: './skill.component.scss'
})
export class SkillComponent {
  constructor(private skillService: SkillService, private router: Router) { }

  //Variables
  skillData: any;
  isExtended: boolean = false;
  viewSkill: boolean = false;
  isLoaded: boolean = false;
  isDeleted: boolean = false;
  isAddMode: boolean = false;
  isEditMode: boolean = false;
  resetSkill: any = {};
  skill: Skill = {
    title: '',
    description: '',
    id: 0
  };

  //to get the action menu
  expandMenu() {
    this.isExtended = !this.isExtended;
  }

  // Function to call the create form 
  addSkill() {
    this.isAddMode = true
    console.log(this.isAddMode)
  }
  //Function to create a skill
  createSkill() {
    this.skillService.createSkill(this.skill).subscribe({
      next: (data: Skill) => {
        this.resetForm();
        alert('Skill created successfully:');
        this.refreshSkillList();
        this.isAddMode = false;
        this.viewSkill = false;
        this.isEditMode = false;
      },
      error: (error) => {
        console.error('Error creating skill:', error);
      },
    });
  }

  //function to call the skill data in form fields to edit it
  editSkill(id:number) {
    this.isEditMode = true;
    this.skill.id = id;
    if (this.skill.id) {
      this.skillService.findSkill(this.skill.id).subscribe({
        next: (response: any) => {
          this.skill = response
          console.log(this.skill)
          this.isLoaded = true
        },
        error: (error) => {
          console.error('Error fetching skill data:', error);
        }
      });
    }
  }

  //function to update the skill
  updateSkill() { 
    var skill = {
      id:this.skill.id,
      title: this.skill.title,
      description: this.skill.description
    }
    this.skillService.updateSkill(skill).subscribe({
      next: (response: any) => {
        this.resetForm();
        this.refreshSkillList();
        alert("Data updated successfully")
        this.isEditMode =false;
      }
    })
  }

  //function to view the detail of Skill data
  viewDetail(id: number) {
    this.viewSkill = true
    this.skillService.findSkill(id).subscribe({
      next: (data: any) => {
        this.skillData = data;
        this.isLoaded = true;
      }
    })
  }

  //function to delete a Skill
  deleteSkill(id: number): void {
    console.log(id)
    this.skillService.deleteSkill(id).subscribe({
      next: () => {
        this.refreshSkillList();
        if (this.isDeleted) {
          alert(`Skill with ${id} is deleted Successfully.`)
        }
      },
      error: (error: any) => {
        console.error('Error deleting skill:', error);
      }
    });
  }

  ngOnInit(): void {
    this.refreshSkillList();
  }

  //Get all the skills
  private refreshSkillList(): void {
    this.skillService.getAllSkills().subscribe({
      next: (response: any) => {
        this.skillData = response.items;
        this.isDeleted = true;
      },
      error: (error: any) => {
        console.error('Error fetching skills:', error);
      }
    });
  }

  //reset form fields
  resetForm() {
    this.skill = {
      title: '',
      description: '',
      id:0
    }
  }

}

