export interface Agence {
  idAgence: number;
  nomAgence: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
  responsable: string;
  dateCreation?: string;
}