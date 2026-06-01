/**
 * @file reporting.types.ts
 * @description Types TypeScript pour le module Reporting / Dashboard.
 * @author Riahi Dorsaf
 */

export interface ActiviteRecenteItem {
  id:              number;
  type:            string;       // entiteType : "CLIENT" | "CONTACT" | "PRODUIT" | "REUNION"
  typeActivite:    string;       // TypeActivite : "CLIENT_CREE", "CONTACT_AJOUTE"…
  titre:           string;       // label de l'action : "Nouveau client ajouté"
  soustitre:       string;       // nom de l'entité : "Ahmed Ben Ali"
  dateRelative:    string;
  entiteParentId?: number | null;
}

export type TypeActivite =
  | 'CLIENT_CREE'         | 'CLIENT_MODIFIE'       | 'CLIENT_SUPPRIME'
  | 'CONTACT_AJOUTE'      | 'CONTACT_MODIFIE'      | 'CONTACT_SUPPRIME'
  | 'PRODUIT_CREE'        | 'PRODUIT_MODIFIE'      | 'PRODUIT_ARCHIVE'
  | 'PRODUIT_DESARCHIVE'  | 'PRODUIT_ACTIVE'       | 'PRODUIT_DESACTIVE'
  | 'OPPORTUNITE_CREEE'   | 'DEVIS_CREE'           | 'PUBLICATION_CREEE'
  | 'REUNION_PLANIFIEE'   | 'REUNION_TERMINEE'     | 'REUNION_ANNULEE'
  | 'REUNION_MODIFIEE';

/** Type de l'entité concernée par une activité — FIX : ajout de REUNION */
export type EntiteType = 'CLIENT' | 'CONTACT' | 'PRODUIT' | 'REUNION';

export interface ActiviteResponse {
  id:              number;
  type:            TypeActivite;
  titre:           string;
  description:     string;
  entiteId:        number;
  entiteType:      EntiteType;
  entiteParentId?: number | null;
  dateRelative:    string;
  dateCreation:    string;
}

export interface ReportingKpisResponse {
  nbClients:       number;
  nbOpportunites:  number;
  chiffreAffaires: number;
  nbDevis:         number;
  sparkline:       number[];
  activiteRecente: ActiviteRecenteItem[];
}

// ─────────────────────────────────────────────────────────────
// Stats ventes avancées
// ─────────────────────────────────────────────────────────────

export interface StatutOpportuniteCount {
  statut: string;
  count:  number;
}

export interface OpportuniteResume {
  id:            number;
  titre:         string;
  clientNom:     string;
  montantEstime: number | null;
  statut:        string;
}

export interface StatsVentesResponse {
  nbLeadsActifs:                number;
  tauxConversionLeads:          number;
  valeurPipeline:               number;
  tauxConversionOpportunites:   number;
  tauxAcceptationDevis:         number;
  panierMoyen:                  number;
  repartitionOpportunites:      StatutOpportuniteCount[];
  top3Opportunites:             OpportuniteResume[];
}

export interface CaMensuelDto {
  mois:    number;
  annee:   number;
  montant: number;
  label:   string;
}

export interface PageResponse<T> {
  content:       T[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
  last:          boolean;
}

export type PeriodeDashboard = 'AUJOURD_HUI' | 'CE_MOIS' | 'CETTE_ANNEE';

export const PERIODE_LABELS: Record<PeriodeDashboard, string> = {
  AUJOURD_HUI: "Aujourd'hui",
  CE_MOIS:     'Ce mois',
  CETTE_ANNEE: 'Cette année',
};

/** Icône Ionicons par TypeActivite */
export const ACTIVITE_ICONE: Record<string, string> = {
  CLIENT_CREE:        'person-add-outline',
  CLIENT_MODIFIE:     'person-outline',
  CLIENT_SUPPRIME:    'person-remove-outline',
  CONTACT_AJOUTE:     'call-outline',
  CONTACT_MODIFIE:    'call-outline',
  CONTACT_SUPPRIME:   'call-outline',
  PRODUIT_CREE:       'cube-outline',
  PRODUIT_MODIFIE:    'create-outline',
  PRODUIT_ARCHIVE:    'archive-outline',
  PRODUIT_DESARCHIVE: 'arrow-up-circle-outline',
  PRODUIT_ACTIVE:     'checkmark-circle-outline',
  PRODUIT_DESACTIVE:  'pause-circle-outline',
  OPPORTUNITE_CREEE:  'trending-up-outline',
  DEVIS_CREE:         'document-text-outline',
  PUBLICATION_CREEE:  'megaphone-outline',
  REUNION_PLANIFIEE:  'calendar-outline',
  REUNION_TERMINEE:   'checkmark-circle-outline',
  REUNION_ANNULEE:    'close-circle-outline',
  REUNION_MODIFIEE:   'calendar-outline',
};

/** Couleur de fond de l'icône par TypeActivite */
export const ACTIVITE_BG: Record<string, string> = {
  CLIENT_CREE:        '#EFF6FF',
  CLIENT_MODIFIE:     '#EFF6FF',
  CLIENT_SUPPRIME:    '#FEF2F2',
  CONTACT_AJOUTE:     '#F0FDF4',
  CONTACT_MODIFIE:    '#F0FDF4',
  CONTACT_SUPPRIME:   '#FEF2F2',
  PRODUIT_CREE:       '#F5F3FF',
  PRODUIT_MODIFIE:    '#F5F3FF',
  PRODUIT_ARCHIVE:    '#FFF7ED',
  PRODUIT_DESARCHIVE: '#F0FDF4',
  PRODUIT_ACTIVE:     '#F0FDF4',
  PRODUIT_DESACTIVE:  '#FFF7ED',
  OPPORTUNITE_CREEE:  '#F0FDF4',
  DEVIS_CREE:         '#EFF6FF',
  PUBLICATION_CREEE:  '#FFF7ED',
  REUNION_PLANIFIEE:  '#EFF6FF',
  REUNION_TERMINEE:   '#F0FDF4',
  REUNION_ANNULEE:    '#FEF2F2',
  REUNION_MODIFIEE:   '#EFF6FF',
};

/** Couleur de l'icône par TypeActivite */
export const ACTIVITE_ICON_COLOR: Record<string, string> = {
  CLIENT_CREE:        '#2563EB',
  CLIENT_MODIFIE:     '#2563EB',
  CLIENT_SUPPRIME:    '#DC2626',
  CONTACT_AJOUTE:     '#16A34A',
  CONTACT_MODIFIE:    '#16A34A',
  CONTACT_SUPPRIME:   '#DC2626',
  PRODUIT_CREE:       '#7C3AED',
  PRODUIT_MODIFIE:    '#7C3AED',
  PRODUIT_ARCHIVE:    '#EA580C',
  PRODUIT_DESARCHIVE: '#16A34A',
  PRODUIT_ACTIVE:     '#16A34A',
  PRODUIT_DESACTIVE:  '#EA580C',
  OPPORTUNITE_CREEE:  '#16A34A',
  DEVIS_CREE:         '#2563EB',
  PUBLICATION_CREEE:  '#EA580C',
  REUNION_PLANIFIEE:  '#2563EB',
  REUNION_TERMINEE:   '#16A34A',
  REUNION_ANNULEE:    '#DC2626',
  REUNION_MODIFIEE:   '#2563EB',
};