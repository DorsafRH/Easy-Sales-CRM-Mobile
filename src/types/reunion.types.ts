/**
 * @file reunion.types.ts
 * @description Types TypeScript pour le module Agenda / Réunions.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────

export type StatutReunion    = 'PLANIFIEE' | 'TERMINEE' | 'ANNULEE';
export type TypeParticipant  = 'CLIENT' | 'CONTACT' | 'EXTERNE';

// ─────────────────────────────────────────────────────────────
// PARTICIPANT
// ─────────────────────────────────────────────────────────────

export interface ReunionParticipant {
  nom:        string;
  prenom?:    string;
  email?:     string;
  telephone?: string;
  type:       TypeParticipant;
}

// ─────────────────────────────────────────────────────────────
// DTOs
// ─────────────────────────────────────────────────────────────

export interface ReunionResponse {
  id:              number;
  titre:           string;
  dateHeure:       string;
  dureeMinutes:    number;
  lieu:            string | null;
  notes:           string | null;
  statut:          StatutReunion;
  enLigne:         boolean;
  /** Lien Jitsi / Google Meet / Teams — null si présentiel */
  lienReunion:     string | null;
  clientId:        number;
  clientNom:       string;
  participants:    ReunionParticipant[];
  rappelsMinutes:  number[];
  dateRelative:    string;
  dateCreation:    string;
}

export interface ReunionRequest {
  titre:             string;
  dateHeure:         string;
  dureeMinutes:      number;
  clientId:          number;
  lieu?:             string;
  notes?:            string;
  enLigne?:          boolean;
  lienReunion?:      string;
  participants:      ReunionParticipant[];
  rappelsMinutes:    number[];
  envoyerInvitation?: boolean;
}

// ─────────────────────────────────────────────────────────────
// OPTIONS DURÉE
// ─────────────────────────────────────────────────────────────

export interface DureeOption {
  label:   string;
  minutes: number;
}

export const DUREES: DureeOption[] = [
  { label: '15 min',   minutes: 15  },
  { label: '30 min',   minutes: 30  },
  { label: '45 min',   minutes: 45  },
  { label: '1 heure',  minutes: 60  },
  { label: '1h 30',    minutes: 90  },
  { label: '2 heures', minutes: 120 },
  { label: '3 heures', minutes: 180 },
  { label: '4 heures', minutes: 240 },
];

// ─────────────────────────────────────────────────────────────
// OPTIONS RAPPEL
// ─────────────────────────────────────────────────────────────

export interface RappelOption {
  label:   string;
  minutes: number;
}

export const RAPPELS: RappelOption[] = [
  { label: "À l'heure exacte", minutes: 0     },
  { label: '15 minutes avant', minutes: 15    },
  { label: '30 minutes avant', minutes: 30    },
  { label: '1 heure avant',    minutes: 60    },
  { label: '2 heures avant',   minutes: 120   },
  { label: '1 jour avant',     minutes: 1440  },
  { label: '2 jours avant',    minutes: 2880  },
  { label: '1 semaine avant',  minutes: 10080 },
];

// ─────────────────────────────────────────────────────────────
// CONFIG STATUT
// ─────────────────────────────────────────────────────────────

export const STATUT_REUNION_CONFIG: Record<StatutReunion, {
  label:  string;
  color:  string;
  bg:     string;
  icon:   string;
}> = {
  PLANIFIEE: { label: 'Planifiée', color: '#2563EB', bg: '#EFF6FF', icon: 'time-outline'      },
  TERMINEE:  { label: 'Terminée',  color: '#16A34A', bg: '#F0FDF4', icon: 'checkmark-circle-outline' },
  ANNULEE:   { label: 'Annulée',   color: '#DC2626', bg: '#FEF2F2', icon: 'close-circle-outline'     },
};

// ─────────────────────────────────────────────────────────────
// CONFIG TYPE PARTICIPANT
// ─────────────────────────────────────────────────────────────

export const TYPE_PARTICIPANT_CONFIG: Record<TypeParticipant, {
  label: string;
  color: string;
  bg:    string;
}> = {
  CLIENT:  { label: 'Client',  color: '#2563EB', bg: '#EFF6FF' },
  CONTACT: { label: 'Contact', color: '#7C3AED', bg: '#F5F3FF' },
  EXTERNE: { label: 'Externe', color: '#EA580C', bg: '#FFF7ED' },
};