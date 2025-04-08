import { Agence } from './agences.model';

export interface Performance {
  idPerformance: number;
  chiffreAffaire: number;
  nombreContrats: number;
  dateDebut: string;
  dateFin: string;
  agence: Agence;
} 