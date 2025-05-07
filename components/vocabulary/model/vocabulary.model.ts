
export interface Vocabulary{
    id:number,
    r_domainToVocabulary_c_domainId?: any,
    titleCurrentValue: string,
    domain: DomainInVocabulary,
}

export interface DomainInVocabulary{
    id:number,
    title: string
}
