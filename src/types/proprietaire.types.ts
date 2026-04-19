/**
 * @file proprietaire.types.ts
 * @description Types TypeScript pour la gestion du profil propriétaire.
 * @author Riahi Dorsaf
 */

export type TailleEntreprise = 'TPE' | 'PME' | 'GE';

/** Réponse profil complet du propriétaire */
export interface ProfilProprietaireResponse {
  userId:               number;
  nom:                  string;
  prenom:               string;
  email:                string;
  telephone:            string | null;
  entrepriseId:         number | null;
  nomEntreprise:        string | null;
  secteurActivite:      string | null;
  tailleEntreprise:     TailleEntreprise | null;
  telephoneEntreprise:  string | null;
  adresse:              string | null;
  ville:                string | null;
  pays:                 string | null;
  siteWeb:              string | null;
}

/** Requête modification profil personnel */
export interface ModifierProfilRequest {
  nom:       string;
  prenom:    string;
  telephone: string;
}

/** Requête modification données entreprise */
export interface ModifierEntrepriseRequest {
  nomEntreprise:   string;
  secteurActivite: string;
  tailleEntreprise: TailleEntreprise;
  telephone:       string;
  adresse:         string;
  ville:           string;
  pays:            string;
  siteWeb:         string;
}