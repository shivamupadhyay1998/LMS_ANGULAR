
export interface Course {
    r_domainToCourse_c_domainId: any,
    r_sectorToCourse_c_sectorId: any,
    id:number,
    courseTitle: string,
    description: string,
    courseURL: string,
    cPECredit: string,
    thumbnailImage: any,
    startDate: Date,
    endDate: Date,
    role: string,
    passingMarks:string,
    level:Level,
    courseMembership:CourseMembership,
    active:Active,
    domain: DomainInCourse,
    sector: SectorInCourse,
}

export interface DomainInCourse{
    id: number;
    title: string
}

export interface SectorInCourse{
    id: number;
    title: string
}

export interface Active{
    key: string,
    name: string,
}

export interface CourseMembership{
    key: string,
    name: string,
}

export interface Level{
    key: string,
    name: string,
}
