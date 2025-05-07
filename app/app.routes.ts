import { Routes } from '@angular/router';
import { LessonComponent } from './components/lesson/web/lesson.component';
import { SectorComponent } from './components/sector/web/sector.component';
import { TopicComponent } from './components/topic/web/topic.component';
import { AppComponent } from './app.component';
import { DomainComponent } from './components/domain/web/domain.component';
import { CourseComponent } from './components/course/web/course.component';
import { FaqComponent } from './components/faq/web/faq/faq.component';
import { CountryComponent } from './components/country/web/country.component';
import { YesnoComponent } from './components/yesno/web/yesno/yesno.component';
import { StateComponent } from './components/state/web/state.component';
import { VocabularyComponent } from './components/vocabulary/web/vocabulary/vocabulary.component';
import { SkillComponent } from './components/skill/web/skill/skill.component';
import { CurrencyComponent } from './components/currency/web/currency.component';
import { LearningpathComponent } from './components/learningpath/web/learningpath.component';
import { LessonbycourseComponent } from './components/course/web/lessonbycourse/lessonbycourse/lessonbycourse.component';
import { DesignationComponent } from './components/designation/web/designation.component';
import { AssessmenttypeComponent } from './components/assessmenttype/assessmenttype.component';
import { AssessmentlevelComponent } from './components/assessmentlevel/assessmentlevel.component';
import { AssessmentPhotoComponent } from './components/assessmentphoto/web/assessment-photo/assessment-photo.component';
import { NoteComponent } from './components/note/web/note/note.component';
import { TopicstatusComponent } from './components/topicstatus/web/topicstatus/topicstatus.component';
import { QuestionSetComponent } from './components/questionSet/web/question-set.component';
import { AssessmentComponent } from './components/assessment/web/assessment.component';

export const routes: Routes = [
    {
        path:"home",
        component:AppComponent
    },
    {
        path:"domain",
        component:DomainComponent
    },
    {
        path:"sector",
        component: SectorComponent
    },
    {
        path:"course",
        component: CourseComponent
    },
    {
        path:"lesson",
        component: LessonComponent
    },
    {
        path:"topic",
        component: TopicComponent
    },
    {
        path:"faq",
        component: FaqComponent
    },

    {
        path:"country",
        component: CountryComponent
    },

    {
        path:"YesNo",
        component: YesnoComponent
    },

    {
        path:"state",
        component: StateComponent
    },

    {
        path:"vocabulary",
        component: VocabularyComponent
    },
    {
        path:"Skill",
        component: SkillComponent
    },
    {
        path:"Currency",
        component: CurrencyComponent
    },
    {
        path:"Learning Path",
        component: LearningpathComponent
    },
    {
        path:"designation",
        component: DesignationComponent
    },
    {
        path:"assessment",
        component: AssessmentComponent
    },
    {
        path:"assessment-type",
        component: AssessmenttypeComponent
    },
    {
        path:"assessment-level",
        component: AssessmentlevelComponent
    },
    {
        path:"assessment photo",
        component: AssessmentPhotoComponent
    },
    {
        path:"note",
        component: NoteComponent
    },
    {
        path:"Topic Status",
        component: TopicstatusComponent
    },
    {
        path:"Question Set",
        component: QuestionSetComponent
    },



    
    


    
    
];
