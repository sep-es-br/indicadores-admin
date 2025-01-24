export interface IOrganizerAdminDto {
    nameAdministration: string;
    nameOrganizer: string;
    typeOrganizer: string;
    idOrganizer: string;
    children: IOrganizerAdminDto[]; 
  }
  