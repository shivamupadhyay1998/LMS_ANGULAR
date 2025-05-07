import { Domain } from "../../domain/model/domain.model";

export interface Designation{
    id: number,
    name: string,
    designationCode: string,
    r_domainToDesignation_c_domainId: number,
    domain: DomainInDesignation
}

export interface DomainInDesignation{
    id: number,
    title: string
}
