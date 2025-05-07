export interface Note{
    id: number,
    note: string,
    r_topicToNote_c_topicId ?: any,
    topic : TopicToNote
}

export interface TopicToNote{
    id: number,
    topicName: string
}