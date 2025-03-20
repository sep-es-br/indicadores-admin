
export interface IIndicator {
    uuId: string;
    name: string;
    measureUnit: string;
    polarity: string;
    measures: IChallengeOrgan[];
    odsgoal: IOdsGoal[];
    targetsFor: IIndicatorValue[];
    resultedIn: IIndicatorValue[];
  }

export interface IIndicatorValue {
    period?: number
    type?: string
    year: number
    showValue: string
    value: number
}

export interface IOdsGoal {
    order: string;
}


export interface IChallengeOrgan {
    challengeId: string;
    organ: string;
}
  
export interface IIndicatorForm {
    id?: string
    name: string
    polarity: string
    measureUnit: string
    organizationAcronym: IChallengeOrgan[]
    ods: string[]
    targetsFor: IIndicatorValue[]
    resultedIn: IIndicatorValue[]
}

export interface IIndicatorDetails  {
    uuId: string
    name: string
    organizationAcronym: string
}
