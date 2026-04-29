/**
 * @file client.types.ts
 * @description Types TypeScript pour le module Clients (Sprint 2).
 *              Correspond aux DTOs backend ClientRequest / ClientResponse.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// ÉNUMÉRATIONS
// ─────────────────────────────────────────────────────────────

/** Type de client : personne physique ou morale */
export type TypeClient = 'INDIVIDUEL' | 'ENTREPRISE';

// ─────────────────────────────────────────────────────────────
// RÉPONSE API
// ─────────────────────────────────────────────────────────────

/**
 * Réponse complète d'un client retournée par le backend.
 * Les champs nom/prenom sont renseignés pour INDIVIDUEL,
 * raisonSociale pour ENTREPRISE.
 */
export interface ClientResponse {
  id:             number;
  typeClient:     TypeClient;
  nomAffichage:   string;
  email:          string | null;
  telephone:      string | null;
  adresse:        string | null;
  ville:          string | null;
  pays:           string | null;
  statut:         string;
  dateCreation:   string;

  /** Spécifique INDIVIDUEL */
  nom:            string | null;
  prenom:         string | null;

  /** Spécifique ENTREPRISE */
  raisonSociale:  string | null;

  /** Calculés côté backend */
  nbContacts:      number;
  chiffreAffaires: number;
}

// ─────────────────────────────────────────────────────────────
// REQUÊTE API
// ─────────────────────────────────────────────────────────────

/**
 * Corps de requête pour la création ou la modification d'un client.
 */
export interface ClientRequest {
  typeClient:    TypeClient;
  email?:        string;
  telephone?:    string;
  adresse?:      string;
  ville?:        string;
  pays?:         string;

  /** Requis si typeClient = 'INDIVIDUEL' */
  nom?:          string;
  prenom?:       string;

  /** Requis si typeClient = 'ENTREPRISE' */
  raisonSociale?: string;
}

// ─────────────────────────────────────────────────────────────
// ÉTAT FORMULAIRE (mobile)
// ─────────────────────────────────────────────────────────────

/**
 * État local du formulaire de création / modification d'un client.
 * Utilisé dans ClientFormScreen.
 */
export interface ClientFormState {
  typeClient:    TypeClient;
  email:         string;
  telephone:     string;
  adresse:       string;
  ville:         string;
  pays:          string;
  nom:           string;
  prenom:        string;
  raisonSociale: string;
}

/** Valeurs initiales du formulaire client */
export const INITIAL_CLIENT_FORM: ClientFormState = {
  typeClient:    'INDIVIDUEL',
  email:         '',
  telephone:     '',
  adresse:       '',
  ville:         '',
  pays:          'Tunisie',
  nom:           '',
  prenom:        '',
  raisonSociale: '',
};

// ─────────────────────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────────────────────

/**
 * Réponse paginée générique retournée par le backend Spring.
 * Utilisée pour la liste clients.
 */
export interface PageResponse<T> {
  content:       T[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
  last:          boolean;
}

// ─────────────────────────────────────────────────────────────
// FILTRES
// ─────────────────────────────────────────────────────────────

/**
 * Paramètres de filtrage pour la liste clients.
 */
export interface ClientFiltres {
  typeClient?: TypeClient | 'TOUS';
  keyword?:    string;
  page?:       number;
  size?:       number;
}