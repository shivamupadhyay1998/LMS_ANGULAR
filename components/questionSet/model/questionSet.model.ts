export interface QuestionSet{
    id: number,
    title: string,
    r_courseToQuestionSet_c_courseId: any,
    r_assessmentTypeToQuestionSet_c_assessmentTypeId: any,
    r_assessmentLevelToQuestionSet_c_assessmentLevelId: any,
    course: CourseInQuestionSet,
    assessmentType: AssessmentTypeInQuestionSet,
    assessmentLevel: AssessmentLevelInQuestionSet
}

export interface CourseInQuestionSet{
    id: number,
    courseTitle: string
}

export interface AssessmentTypeInQuestionSet{
    id: number,
    typeName: string
}

export interface AssessmentLevelInQuestionSet{
    id: number,
    title: string
}