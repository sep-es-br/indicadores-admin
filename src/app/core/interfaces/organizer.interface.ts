import { IChallenge } from "./challenge.interface";

export interface IOrganizerAdmin {
    nameAdministration: string;
    nameOrganizer: string;
    typeOrganizer: string;
    typeOrganizerPlural: string;
    idOrganizer: string;
    children: IOrganizerAdmin[];
    challengeList?: IChallenge[]; 
  }

  export interface IOrganizerItem {
    id?: string;
    name: string;
    description: string;
    icon: string;
    editable: boolean;
  }

  export interface IStructureChild {
    structureName: string;
    namePlural?: string;
    children?: IStructureChild[];
    editable: boolean;
  }

  export interface IStructure {
    name: string;
    nameInPlural: string;
    relationshipType: string;
  } 