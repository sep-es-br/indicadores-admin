export interface IOrganizerAdmin {
    nameAdministration: string;
    nameOrganizer: string;
    typeOrganizer: string;
    typeOrganizerPlural: string;
    idOrganizer: string;
    children: IOrganizerAdmin[]; 
  }

  export interface IOrganizerItem {
    name: string;
    description: string;
    structureName: string;
    structureNamePlural: string;
    icon: string;
    children: IOrganizerItem[];
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




  