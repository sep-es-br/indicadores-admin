export interface IIndicator{
    id?: string
    name: string
    polarity: string
    measureUnit: string
    organizationAcronym: string
    targetsFor: IIndicatorValue[]
    resultedIn: IIndicatorValue[]
}

export interface IIndicatorValue {
    period: number
    type: string
    year: number
    showValue: string
    value: number
}
