export interface Topic{
    id:number,
    r_lessonToTopic_c_lessonId:any,
    topicName: string,
    summary: string,
    completionTimeInHrs: string,
    active: Active,
    sequenceNo: string,
    textContent: string,
    imageContent : any,
    videoContent: any,
    document: any,
    lesson : LessonInTopic
}

export interface LessonInTopic{
    id: number,
    lessonName: string,
}

export interface Active{
    key: string,
    name: string,
}
