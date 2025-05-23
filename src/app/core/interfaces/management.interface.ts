import { IOrganizerAdmin } from "./organizer.interface";

export interface IManagement{
    name: string,
    description: string,
    startYear: number,
    endYear:number,
    active?:boolean,
    id?:string
    modelName?: string[]; 
    modelNameInPlural?: string[];
    organizerList?: IOrganizerAdmin[]; 
}

export interface IManagementInfo{
    name: string,
    id: string,
    modelName: string,
    parentOrganizerId?: string,
    parentOrganizerName?: string
}

