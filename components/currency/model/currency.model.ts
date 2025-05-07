export interface Currency{
    id: number,
    currencyCode: string,
    currencyName: string,
    r_countryToCurrency_c_countryId: any,
    country: CountryToCurrency,
}

export interface CountryToCurrency{
    id: number,
    name: string
}