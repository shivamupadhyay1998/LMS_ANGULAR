
export interface Lesson{
    id:number,
    r_courseToLesson_c_courseId: any,
    lessonName: string,
    summary: string,
    completionTimeInHrs : string,
    active : Active,
    course: CourseInLesson,
    day: Day,
    sequenceNo : string
}

export interface CourseInLesson{
    id: number,
    courseTitle: string
}

export interface Active{
    key: string,
    name: string,
}

export interface Day{
    key: string,
    name: string,
}