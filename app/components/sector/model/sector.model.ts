
export interface Sector{
    id: number,
    r_domain_c_domainId : any,
    title: string,
    description: string,
    domain: DomainInSector,
}

export interface DomainInSector{
    id: number,
    title: string
}
