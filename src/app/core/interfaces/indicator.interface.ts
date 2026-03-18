export interface IIndicator {
  uuId: string;
  name: string;
  measureUnit: string;
  polarity: string;
  measures: IChallengeOrgan[];
  odsgoal: IOdsGoal[];
  justificationBase?: string;
  observations?: string;
  times: ITimes[],
  originalFileName?: string;
}
export interface ITimes {
  type: string,
  year: string,
  period: number,
  valueGoal: number,
  showValueGoal: string,
  valueResult: number,
  showValueResult: string,
  justificationGoal: string,
}
export interface IIndicatorValue {
  period?: number;
  type?: string;
  year: number;
  showValue: string;
  value: number;
  justificationGoal: string;
}

export interface IOdsGoal {
  order: string;
}

export interface IChallengeOrgan {
  challengeId: string;
  organ: string;
}

export interface IIndicatorForm {
  id?: string;
  name: string;
  polarity: string;
  measureUnit: string;
  organizationAcronym: IChallengeOrgan[];
  ods: string[];
  times: ITimes[];
  justificationBase?: string;
  justificationGoal?: string;
  observations?: string;
  removePdf?: boolean;
}

export interface IIndicatorDetails {
  uuId: string;
  name: string;
  organizationAcronym: string;
}
