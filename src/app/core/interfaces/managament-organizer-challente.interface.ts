export interface IManagementOrganizerChallenge {
    managementName: string;
    organizers: IOrganizerChallenge[];
}

export interface IOrganizerChallenge {
    name: string;
    challenges: IChallengeNameId[];
}

export interface IChallengeNameId {
    name: string;
    uuId: string;
    selected?: boolean;
}
