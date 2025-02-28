import { IOds } from "./ods.interface"

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
    period?: number
    type?: string
    year: number
    showValue: string
    value: number
}

export interface IChallengeOrgan {
    challengeId: string;
    organ: string;
}
  
export interface INewIndicator{
    id?: string
    name: string
    polarity: string
    measureUnit: string
    organizationAcronym: IChallengeOrgan[]
    ods: number[]
    targetsFor: IIndicatorValue[]
    resultedIn: IIndicatorValue[]
}
