/**
 * @file contact.types.ts
 * @description Types TypeScript pour le module Contacts (Sprint 2).
 *              Correspond aux DTOs backend ContactRequest / ContactResponse.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// RÉPONSE API
// ─────────────────────────────────────────────────────────────

/**
 * Réponse complète d'un contact retournée par le backend.
 */
export interface ContactResponse {
  id:                  number;
  nom:                 string;
  prenom:              string | null;
  nomComplet:          string;
  email:               string | null;
  telephone:           string | null;
  poste:               string | null;
  isPrincipal:         boolean;
  dateCreation:        string;
  clientId:            number;
  clientNomAffichage:  string;
}

// ─────────────────────────────────────────────────────────────
// REQUÊTE API
// ─────────────────────────────────────────────────────────────

/**
 * Corps de requête pour la création ou la modification d'un contact.
 */
export interface ContactRequest {
  nom:          string;
  prenom?:      string;
  email?:       string;
  telephone?:   string;
  poste?:       string;
  isPrincipal?: boolean;
}

// ─────────────────────────────────────────────────────────────
// ÉTAT FORMULAIRE (mobile)
// ─────────────────────────────────────────────────────────────

/**
 * État local du formulaire de création / modification d'un contact.
 * Utilisé dans ContactFormScreen.
 */
export interface ContactFormState {
  nom:         string;
  prenom:      string;
  email:       string;
  telephone:   string;
  poste:       string;
  isPrincipal: boolean;
}

/** Valeurs initiales du formulaire contact */
export const INITIAL_CONTACT_FORM: ContactFormState = {
  nom:         '',
  prenom:      '',
  email:       '',
  telephone:   '',
  poste:       '',
  isPrincipal: false,
};

// ─────────────────────────────────────────────────────────────
// ERREURS FORMULAIRE
// ─────────────────────────────────────────────────────────────

/** Map d'erreurs de validation du formulaire contact */
export type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;