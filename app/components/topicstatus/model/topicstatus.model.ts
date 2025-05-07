export interface Topicstatus{
id:number;
name:string;
completionTime:string;
timeSpent:string;
completed:Completed;
videoTime:string;
r_topicToTopicStatus_c_topicId:number;
r_lesssonToTopicStatus_c_lessonId:number;
r_courseToTopicStatus_c_courseId:number;
topic:TopicInTopicstatus;
lesson:LessonInTopicstatus;
course:CourseInTopicstatus;
}
export interface CourseInTopicstatus{
    id:number;
    courseTitle:string;
}
export interface LessonInTopicstatus{
    id:number;
    lessonName:string;
}
export interface TopicInTopicstatus{
    id:number;
    topicName:string;
}
export interface Completed{
    key: string,
    name: string,
}