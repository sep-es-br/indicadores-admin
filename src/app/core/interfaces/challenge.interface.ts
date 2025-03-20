import { IIndicatorDetails } from "./indicator.interface"

export interface IChallenge{
    name: string,
    id?: string
    uuId?: string;
    indicatorList?: IIndicatorDetails[]
    editable?: boolean
}