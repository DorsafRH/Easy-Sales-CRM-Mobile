/**
 * @file reporting.types.ts
 * @description Types TypeScript pour le module Reporting / Dashboard (Sprint 2).
 *              Correspond au DTO backend ReportingKpisResponse.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// ACTIVITÉ RÉCENTE
// ─────────────────────────────────────────────────────────────

/**
 * Un élément d'activité récente affiché dans le dashboard.
 * Sprint 2 : type = "CLIENT" uniquement.
 */
export interface ActiviteRecenteItem {
  id:           number;
  type:         'CLIENT' | 'OPPORTUNITE' | 'DEVIS';
  titre:        string;
  soustitre:    string;
  dateRelative: string;
}

// ─────────────────────────────────────────────────────────────
// KPIs
// ─────────────────────────────────────────────────────────────

/**
 * Réponse complète de l'endpoint GET /api/reporting/kpis.
 * Sprint 2 : nbClients réel, autres à 0.
 */
export interface ReportingKpisResponse {
  /** Nombre de clients actifs — réel Sprint 2 */
  nbClients:      number;

  /** Opportunités en cours — 0 Sprint 2, réel Sprint 3 */
  nbOpportunites: number;

  /** CA du mois en TND — 0.0 Sprint 2, réel Sprint 3 */
  chiffreAffaires: number;

  /** Devis en attente — 0 Sprint 2, réel Sprint 3 */
  nbDevis:        number;

  /**
   * Données sparkline sur 7 jours.
   * Sprint 2 : [0, 0, 0, 0, 0, 0, 0]
   */
  sparkline:      number[];

  /**
   * Activité récente — 5 derniers clients créés (Sprint 2).
   */
  activiteRecente: ActiviteRecenteItem[];
}

// ─────────────────────────────────────────────────────────────
// FILTRE PÉRIODE (mobile uniquement — non envoyé au backend Sprint 2)
// ─────────────────────────────────────────────────────────────

/**
 * Sélecteur de période affiché dans le Dashboard.
 * Sprint 2 : affichage cosmétique uniquement (API renvoie des données fixes).
 * Sprint 3 : sera utilisé pour filtrer les KPIs.
 */
export type PeriodeDashboard = 'AUJOURD_HUI' | 'CE_MOIS' | 'CETTE_ANNEE';

/**
 * Libellés des périodes pour l'UI.
 */
export const PERIODE_LABELS: Record<PeriodeDashboard, string> = {
  AUJOURD_HUI:  "Aujourd'hui",
  CE_MOIS:      'Ce mois',
  CETTE_ANNEE:  'Cette année',
};