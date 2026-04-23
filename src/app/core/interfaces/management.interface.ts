import { IOrganizerAdmin } from "./organizer.interface";

export interface IManagement {
    name: string,
    description: string,
    startYear: number,
    endYear: number,
    active?: boolean,
    id?: string
    isExpanded?: boolean;
    modelName?: string[];
    modelNameInPlural?: string[];
    organizerList?: IOrganizerAdmin[];
}

export interface IManagementInfo {
    name: string,
    id?: string,
    administratorId?: string,
    modelName: string,
    modelNameInPlural?: string,
    parentOrganizerId?: string,
    parentOrganizerName?: string
}

