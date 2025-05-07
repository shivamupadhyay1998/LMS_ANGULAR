
export interface Assessment{
    id:number,
    r_assessmentLevelToAssessment_c_assessmentLevelId: any,
    r_courseToAssessment_c_courseId: any,
    noOfQuestionsPerLesson : NoOfQuestionsPerLesson,
    testType: TestType,
    course: CourseInAssessment,
    assessmentLevel:AssessmentLevelInAssessment,
}

export interface AssessmentLevelInAssessment{
    id: number,
    title: string
}
export interface CourseInAssessment{
    id: number,
    courseTitle: string
}
export interface NoOfQuestionsPerLesson{
    key: string,
    name: string,
}

export interface TestType{
    key: string,
    name: string,
}