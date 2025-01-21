export interface IManagement{
    name: string,
    description: string,
    startYear: number,
    endYear:number,
    active?:boolean,
    id?:string
}

export interface OrganizerItem {
    name: string;
    description: string;
    structureName: string;
    structureNamePlural: string;
    icon: string;
    children: OrganizerItem[];
    editable: boolean;
  }

  export interface StructureChild {
    structureName: string;
    namePlural?: string;
    children?: StructureChild[];
    editable: boolean;
  }