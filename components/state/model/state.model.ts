export interface State{
    id: number,
    name: string,
    r_countryToState_c_countryId : any,
    country : CountryToState
}

export interface CountryToState{
    id: number,
    name: string
}