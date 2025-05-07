export interface LessonSkillSet{
    id: number,
    name: string,
    r_skillToLessonSkillSet_c_skillId : any,
    r_lessonToLessonSkillSet_c_lessonId : any,
    skill : SkillToLessonSkillSet
    lesson : LessionToLessionSkillSet
}

export interface SkillToLessonSkillSet{
    id: number,
    name: string
}
export interface LessionToLessionSkillSet{
    id: number,
    lessonName: string
}
