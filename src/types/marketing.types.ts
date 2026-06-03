/**
 * @file marketing.types.ts
 * @description Types TypeScript du module Marketing IA (Sprint 4).
 *              Alignés sur les DTOs du backend Spring Boot.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

export type StatutPublication =
  | 'BROUILLON' | 'PROGRAMMEE' | 'EN_COURS' | 'PUBLIEE' | 'ECHEC' | 'ANNULEE';

export type StatutDiffusion =
  | 'EN_ATTENTE' | 'EN_COURS' | 'PUBLIEE' | 'ECHEC' | 'ANNULEE';

export type TypeReseau = 'FACEBOOK' | 'INSTAGRAM' | 'TIKTOK';

// ─────────────────────────────────────────────────────────────
// INTERFACES — RÉPONSES
// ─────────────────────────────────────────────────────────────

export interface CompteSocialConnecte {
  id:              number;
  typeReseau:      TypeReseau;
  nomCompte:       string;
  statutConnexion: string;
  dateConnexion:   string | null;
}

export interface DiffusionPublication {
  id:              number;
  statutDiffusion: StatutDiffusion;
  dateDiffusion:   string | null;
  messageErreur:   string | null;
  urlPublication:  string | null;
  compteSocial:    CompteSocialConnecte;
}

export interface PublicationMarketing {
  id:                number;
  titre:             string;
  texte:             string | null;
  mediaUrl:          string | null;
  statut:            StatutPublication;
  dateCreation:      string | null;
  dateProgrammation: string | null;
  datePublication:   string | null;
  diffusions:        DiffusionPublication[];
}

export interface GenererContenuResponse {
  contenuGenere:   string;
  contenuAmeliore: string;
  tokensUtilises:  number;
}

// ─────────────────────────────────────────────────────────────
// INTERFACES — REQUÊTES
// ─────────────────────────────────────────────────────────────

export interface GenererContenuRequest {
  sujet:       string;
  typeContenu: string;
  tonalite:    string;
  langue:      'fr' | 'ar';
  motsCles?:   string[];
}

export interface PublicationRequest {
  titre:              string;
  texte:              string;
  mediaUrl?:          string;
  dateProgrammation?: string;
  comptesSociauxIds?: number[];
}

// ─────────────────────────────────────────────────────────────
// CONFIGURATIONS VISUELLES
// ─────────────────────────────────────────────────────────────

export const STATUT_PUBLICATION_CONFIG:
  Record<StatutPublication, { label: string; color: string; bg: string }> = {
  BROUILLON:  { label: 'Brouillon',  color: '#6B7280', bg: '#F3F4F6' },
  PROGRAMMEE: { label: 'Programmée', color: '#2563EB', bg: '#EFF6FF' },
  EN_COURS:   { label: 'En cours',   color: '#D97706', bg: '#FFFBEB' },
  PUBLIEE:    { label: 'Publiée',    color: '#16A34A', bg: '#F0FDF4' },
  ECHEC:      { label: 'Échec',      color: '#DC2626', bg: '#FEF2F2' },
  ANNULEE:    { label: 'Annulée',    color: '#7C3AED', bg: '#F5F3FF' },
};

export const STATUT_DIFFUSION_CONFIG:
  Record<StatutDiffusion, { label: string; color: string; bg: string }> = {
  EN_ATTENTE: { label: 'En attente', color: '#6B7280', bg: '#F3F4F6' },
  EN_COURS:   { label: 'En cours',   color: '#D97706', bg: '#FFFBEB' },
  PUBLIEE:    { label: 'Publiée',    color: '#16A34A', bg: '#F0FDF4' },
  ECHEC:      { label: 'Échec',      color: '#DC2626', bg: '#FEF2F2' },
  ANNULEE:    { label: 'Annulée',    color: '#7C3AED', bg: '#F5F3FF' },
};

export const TYPE_RESEAU_CONFIG:
  Record<TypeReseau, { label: string; color: string; bg: string; icon: string }> = {
  FACEBOOK:  { label: 'Facebook',  color: '#1877F2', bg: '#EFF6FF', icon: 'logo-facebook'  },
  INSTAGRAM: { label: 'Instagram', color: '#E1306C', bg: '#FEF2F2', icon: 'logo-instagram' },
  TIKTOK:    { label: 'TikTok',    color: '#111827', bg: '#F3F4F6', icon: 'logo-tiktok'    },
};
