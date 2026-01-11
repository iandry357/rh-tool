export interface EntretienAnnuelPage1 {
  collaborateur: {
    nom: string;
    prenom: string;
    fonction: string;
    dateEntree: string;
  };
  manager: {
    nom: string;
    prenom: string;
    fonction: string;
  };
  dateEntretien: string;
}

export interface EntretienAnnuelPage2 {
  clients: string; // textarea pour la liste des clients
  dossierTechniqueAJour: boolean;
  dossierTechniqueTransmis: boolean | null;
}

export interface EntretienAnnuelPage3 {
  objectifsMission: string;
  commentairesCollaborateur: string;
  commentairesManager: string;
  notationCollaborateur: 1 | 2 | 3 | 4 | null;
  notationManager: 1 | 2 | 3 | 4 | null;
}

export interface EntretienAnnuel {
  id?: string;
  page1: EntretienAnnuelPage1;
  page2: EntretienAnnuelPage2;
  page3: EntretienAnnuelPage3;
  statut: 'brouillon' | 'valide';
  createdAt?: string;
  updatedAt?: string;
}