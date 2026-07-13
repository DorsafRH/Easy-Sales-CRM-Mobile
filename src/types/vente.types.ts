/**
 * @file vente.types.ts
 * @description Types TypeScript pour le module Ventes Sprint 3.
 *              Lead, Opportunite, Devis, LigneDevis, Facture, LigneFacture,
 *              ActiviteCommerciale, PipelineKpi.
 * @author Riahi Dorsaf
 */

import { PageResponse } from './client.types';

// ─────────────────────────────────────────────────────────────
// ÉNUMÉRATIONS
// ─────────────────────────────────────────────────────────────

export type StatutLead =
  | 'NOUVEAU'
  | 'CONTACTE'
  | 'QUALIFIE'
  | 'PROPOSITION'
  | 'NEGOCIATION'
  | 'CONVERTI'
  | 'PERDU';

export type StatutOpportunite =
  | 'PROSPECTION'
  | 'QUALIFICATION'
  | 'PROPOSITION'
  | 'NEGOCIATION'
  | 'GAGNEE'
  | 'PERDUE';

export type StatutDevis =
  | 'BROUILLON'
  | 'ENVOYE'
  | 'ACCEPTE'
  | 'REFUSE'
  | 'EXPIRE';

export type StatutFacture =
  | 'BROUILLON'
  | 'EMISE'
  | 'LIVREE'
  | 'PAYEE'
  | 'ANNULEE'
  | 'EN_RETARD';

export type SourceLead =
  | 'SITE_WEB'
  | 'LINKEDIN'
  | 'REFERENCE'
  | 'EMAIL'
  | 'SALON'
  | 'APPEL_ENTRANT'
  | 'FACEBOOK'
  | 'MESSENGER'
  | 'COMMENTAIRE'
  | 'AUTRE';

export type TypeActiviteCommerciale =
  | 'APPEL'
  | 'EMAIL'
  | 'REUNION'
  | 'VISITE'
  | 'TACHE';

export type ResultatActivite =
  | 'POSITIF'
  | 'NEGATIF'
  | 'EN_ATTENTE'
  | 'SANS_REPONSE';

// ─────────────────────────────────────────────────────────────
// LEAD
// ─────────────────────────────────────────────────────────────

export interface LeadResponse {
  id:               number;
  nom:              string;
  email:            string | null;
  telephone:        string | null;
  entreprise:       string | null;
  poste:            string | null;
  source:           SourceLead;
  descriptionBesoin: string | null;
  statut:           StatutLead;
  score:            number;
  raisonPerte:      string | null;
  clientId:         number | null;
  clientNom:        string | null;
  dateCreation:     string;
  dateModification: string | null;
  dateRelative:     string;
}

export interface LeadRequest {
  nom:               string;
  email?:            string;
  telephone?:        string;
  entreprise?:       string;
  poste?:            string;
  source:            SourceLead;
  descriptionBesoin?: string;
  clientId?:         number;
}

// ─────────────────────────────────────────────────────────────
// OPPORTUNITÉ
// ─────────────────────────────────────────────────────────────

export interface OpportuniteResponse {
  id:               number;
  titre:            string;
  description:      string | null;
  montantEstime:    number | null;
  probabilite:      number | null;
  statut:           StatutOpportunite;
  dateCloturePrevue: string | null;
  raisonPerte:      string | null;
  clientId:         number;
  clientNom:        string;
  leadId:           number | null;
  leadNom:          string | null;
  dateCreation:     string;
  dateModification: string | null;
  dateRelative:     string;
}

export interface OpportuniteRequest {
  titre:             string;
  description?:      string;
  montantEstime?:    number;
  probabilite?:      number;
  statut?:           StatutOpportunite;
  dateCloturePrevue?: string;
  raisonPerte?:      string;
  clientId:          number;
  leadId?:           number;
}

/** Structure retournee par GET /opportunites/kanban */
export type KanbanData = Record<StatutOpportunite, OpportuniteResponse[]>;

// ─────────────────────────────────────────────────────────────
// DEVIS
// ─────────────────────────────────────────────────────────────

export interface LigneDevisRequest {
  produitId:        number;
  designation?:     string;
  quantite:         number;
  prixUnitaireHt?:  number;
  tauxTva?:         number;
  remise?:          number;
}

export interface LigneDevisResponse {
  id:             number;
  produitId:      number;
  produitNom:     string;
  designation:    string;
  quantite:       number;
  prixUnitaireHt: number;
  tauxTva:        number;
  remise:         number;
  montantHt:      number;
  montantTva:     number;
  montantTtc:     number;
}

export interface DevisRequest {
  clientId:       number;
  opportuniteId?: number;
  notes?:         string;
  validiteJours?: number;
  lignes:         LigneDevisRequest[];
}

export interface DevisResponse {
  id:               number;
  numero:           string;
  statut:           StatutDevis;
  montantHt:        number;
  montantTva:       number;
  montantTtc:       number;
  notes:            string | null;
  validiteJours:    number;
  clientId:         number;
  clientNom:        string;
  opportuniteId:    number | null;
  opportuniteTitre: string | null;
  /** true si une facture a deja ete generee depuis ce devis — masque le bouton de conversion. */
  dejaConverti:     boolean;
  lignes:           LigneDevisResponse[];
  dateCreation:     string;
  dateModification: string | null;
  dateRelative:     string;
}

// ─────────────────────────────────────────────────────────────
// FACTURE
// ─────────────────────────────────────────────────────────────

export interface LigneFactureResponse {
  id:             number;
  designation:    string;
  quantite:       number;
  prixUnitaireHt: number;
  tauxTva:        number;
  remise:         number;
  montantHt:      number;
  montantTva:     number;
  montantTtc:     number;
  typeProduit?:   string;
}

export interface FactureResponse {
  id:               number;
  numero:           string;
  statut:           StatutFacture;
  montantHt:        number;
  montantTva:       number;
  montantTtc:       number;
  dateEcheance:     string | null;
  dateEmission:     string | null;
  datePaiement:     string | null;
  notes:            string | null;
  clientId:         number;
  clientNom:        string;
  devisNumero:      string | null;
  devisOrigineId:   number | null;
  opportuniteId:    number | null;
  lignes:           LigneFactureResponse[];
  dateCreation:     string;
  dateRelative:     string;
  proprietaireNom?: string;
  dateLivraison?:   string;
}

// ─────────────────────────────────────────────────────────────
// ACTIVITÉ COMMERCIALE
// ─────────────────────────────────────────────────────────────

export interface ActiviteCommercialeResponse {
  id:               number;
  type:             TypeActiviteCommerciale;
  sujet:            string;
  notes:            string | null;
  resultat:         ResultatActivite | null;
  dureeMinutes:     number | null;
  dateActivite:     string;
  dateRelative:     string;
  leadId:           number | null;
  leadNom:          string | null;
  opportuniteId:    number | null;
  opportuniteTitre: string | null;
}

export interface ActiviteCommercialeRequest {
  type:           TypeActiviteCommerciale;
  sujet:          string;
  notes?:         string;
  resultat?:      ResultatActivite;
  dureeMinutes?:  number;
  dateActivite?:  string;
  leadId?:        number;
  opportuniteId?: number;
}

// ─────────────────────────────────────────────────────────────
// KPIs PIPELINE
// ─────────────────────────────────────────────────────────────

export interface PipelineKpiResponse {
  nbLeads:            number;
  nbOpportunites:     number;
  montantPipeline:    number;
  montantGagne:       number;
  nbDevisEnCours:     number;
  nbFacturesImpayees: number;
  repartitionStatuts: Record<StatutOpportunite, number>;
}

// ─────────────────────────────────────────────────────────────
// CONFIGURATIONS VISUELLES
// Note: tous les Record<K, V> sont sur UNE SEULE LIGNE
// pour eviter l'erreur Babel "Missing initializer in const"
// ─────────────────────────────────────────────────────────────

/**
 * Configuration visuelle des badges de statut Lead.
 * labelKey = clé i18n (t(conf.labelKey)) — label conservé pour compat
 * avec les écrans pas encore migrés vers i18n.
 */
export const STATUT_LEAD_CONFIG: Record<StatutLead, { label: string; labelKey: string; color: string; bg: string }> = {
  NOUVEAU:     { label: 'Nouveau',     labelKey: 'ventes.statutLead.NOUVEAU',     color: '#2563EB', bg: '#EFF6FF' },
  CONTACTE:    { label: 'Contacte',    labelKey: 'ventes.statutLead.CONTACTE',    color: '#0891B2', bg: '#ECFEFF' },
  QUALIFIE:    { label: 'Qualifie',    labelKey: 'ventes.statutLead.QUALIFIE',    color: '#7C3AED', bg: '#F5F3FF' },
  PROPOSITION: { label: 'Proposition', labelKey: 'ventes.statutLead.PROPOSITION', color: '#D97706', bg: '#FFFBEB' },
  NEGOCIATION: { label: 'Negociation', labelKey: 'ventes.statutLead.NEGOCIATION', color: '#EA580C', bg: '#FFF7ED' },
  CONVERTI:    { label: 'Converti',    labelKey: 'ventes.statutLead.CONVERTI',    color: '#16A34A', bg: '#F0FDF4' },
  PERDU:       { label: 'Perdu',       labelKey: 'ventes.statutLead.PERDU',       color: '#DC2626', bg: '#FEF2F2' },
};

/** Ordre et configuration visuelle des colonnes du Kanban */
export const KANBAN_COLONNES: Array<{ statut: StatutOpportunite; label: string; labelKey: string; color: string; bg: string; iconName: string }> = [
  { statut: 'PROSPECTION',   label: 'Prospection',  labelKey: 'ventes.statutOpportunite.PROSPECTION',   color: '#2563EB', bg: '#EFF6FF', iconName: 'search-outline'          },
  { statut: 'QUALIFICATION', label: 'Qualification', labelKey: 'ventes.statutOpportunite.QUALIFICATION', color: '#7C3AED', bg: '#F5F3FF', iconName: 'checkmark-circle-outline' },
  { statut: 'PROPOSITION',   label: 'Proposition',  labelKey: 'ventes.statutOpportunite.PROPOSITION',   color: '#D97706', bg: '#FFFBEB', iconName: 'document-text-outline'   },
  { statut: 'NEGOCIATION',   label: 'Negociation',  labelKey: 'ventes.statutOpportunite.NEGOCIATION',   color: '#EA580C', bg: '#FFF7ED', iconName: 'git-branch-outline'      },
  { statut: 'GAGNEE',        label: 'Gagnee',       labelKey: 'ventes.statutOpportunite.GAGNEE',        color: '#16A34A', bg: '#F0FDF4', iconName: 'trophy-outline'          },
  { statut: 'PERDUE',        label: 'Perdue',       labelKey: 'ventes.statutOpportunite.PERDUE',        color: '#DC2626', bg: '#FEF2F2', iconName: 'close-circle-outline'    },
];

/** Configuration visuelle des badges de statut Devis */
export const STATUT_DEVIS_CONFIG: Record<StatutDevis, { label: string; labelKey: string; color: string; bg: string }> = {
  BROUILLON: { label: 'Brouillon', labelKey: 'ventes.statutDevis.BROUILLON', color: '#6B7280', bg: '#F3F4F6' },
  ENVOYE:    { label: 'Envoye',    labelKey: 'ventes.statutDevis.ENVOYE',    color: '#2563EB', bg: '#EFF6FF' },
  ACCEPTE:   { label: 'Accepte',   labelKey: 'ventes.statutDevis.ACCEPTE',   color: '#16A34A', bg: '#F0FDF4' },
  REFUSE:    { label: 'Refuse',    labelKey: 'ventes.statutDevis.REFUSE',    color: '#DC2626', bg: '#FEF2F2' },
  EXPIRE:    { label: 'Expire',    labelKey: 'ventes.statutDevis.EXPIRE',    color: '#D97706', bg: '#FFFBEB' },
};

/** Configuration visuelle des badges de statut Facture */
export const STATUT_FACTURE_CONFIG: Record<StatutFacture, { label: string; labelKey: string; color: string; bg: string }> = {
  BROUILLON: { label: 'Brouillon', labelKey: 'ventes.statutFacture.BROUILLON', color: '#6B7280', bg: '#F3F4F6' },
  EMISE:     { label: 'Emise',     labelKey: 'ventes.statutFacture.EMISE',     color: '#2563EB', bg: '#EFF6FF' },
  LIVREE:    { label: 'Livre',     labelKey: 'ventes.statutFacture.LIVREE',    color: '#16A34A', bg: '#F0FDF4' },
  PAYEE:     { label: 'Payee',     labelKey: 'ventes.statutFacture.PAYEE',     color: '#16A34A', bg: '#F0FDF4' },
  ANNULEE:   { label: 'Annulee',   labelKey: 'ventes.statutFacture.ANNULEE',   color: '#DC2626', bg: '#FEF2F2' },
  EN_RETARD: { label: 'En retard', labelKey: 'ventes.statutFacture.EN_RETARD', color: '#D97706', bg: '#FFFBEB' },
};

/** Configuration visuelle et icone des types d'activite commerciale */
export const TYPE_ACTIVITE_COMMERCIALE_CONFIG: Record<TypeActiviteCommerciale, { label: string; labelKey: string; iconName: string; color: string; bg: string }> = {
  APPEL:   { label: 'Appel',   labelKey: 'ventes.typeActivite.APPEL',   iconName: 'call-outline',     color: '#2563EB', bg: '#EFF6FF' },
  EMAIL:   { label: 'Email',   labelKey: 'ventes.typeActivite.EMAIL',   iconName: 'mail-outline',     color: '#7C3AED', bg: '#F5F3FF' },
  REUNION: { label: 'Reunion', labelKey: 'ventes.typeActivite.REUNION', iconName: 'calendar-outline', color: '#16A34A', bg: '#F0FDF4' },
  VISITE:  { label: 'Visite',  labelKey: 'ventes.typeActivite.VISITE',  iconName: 'car-outline',      color: '#D97706', bg: '#FFFBEB' },
  TACHE:   { label: 'Tache',   labelKey: 'ventes.typeActivite.TACHE',   iconName: 'checkbox-outline', color: '#0891B2', bg: '#ECFEFF' },
};

/** Labels lisibles des sources de lead */
export const SOURCE_LEAD_LABELS: Record<SourceLead, string> = {
  SITE_WEB:     'Site web',
  LINKEDIN:     'LinkedIn',
  REFERENCE:    'Reference',
  EMAIL:        'Email',
  SALON:        'Salon',
  APPEL_ENTRANT: 'Appel entrant',
  FACEBOOK:     'Facebook',
  MESSENGER:    'Facebook',
  COMMENTAIRE:  'Facebook',
  AUTRE:        'Autre',
};

/** Clés i18n des sources de lead (t(SOURCE_LEAD_LABEL_KEYS[source])) */
export const SOURCE_LEAD_LABEL_KEYS: Record<SourceLead, string> = {
  SITE_WEB:     'ventes.sourceLead.SITE_WEB',
  LINKEDIN:     'ventes.sourceLead.LINKEDIN',
  REFERENCE:    'ventes.sourceLead.REFERENCE',
  EMAIL:        'ventes.sourceLead.EMAIL',
  SALON:        'ventes.sourceLead.SALON',
  APPEL_ENTRANT: 'ventes.sourceLead.APPEL_ENTRANT',
  FACEBOOK:     'ventes.sourceLead.FACEBOOK',
  MESSENGER:    'ventes.sourceLead.FACEBOOK',
  COMMENTAIRE:  'ventes.sourceLead.FACEBOOK',
  AUTRE:        'ventes.sourceLead.AUTRE',
};

export { PageResponse };