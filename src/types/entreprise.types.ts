export type StatutCompte =
  | 'EN_ATTENTE'
  | 'ACTIVE'
  | 'SUSPENDU'
  | 'REFUSE';

export type TailleEntreprise = 'TPE' | 'PME' | 'GE';

export interface EntrepriseCompteResponse {
  id:               number;
  nomEntreprise:    string;
  matriculeFiscale: string;
  secteurActivite:  string;
  tailleEntreprise: TailleEntreprise;
  telephone:        string;
  adresse:          string;
  ville:            string;
  pays:             string;
  siteWeb:          string | null;
  statutCompte:     StatutCompte;
  dateCreation:     string;
  dateValidation:   string | null;
  motifRefus:       string | null;
  proprietaireNom:       string;
  proprietairePrenom:    string;
  proprietaireEmail:     string;
  proprietaireTelephone: string | null;
}

export interface InscriptionEntrepriseRequest {
  nomEntreprise:       string;
  matriculeFiscale:    string;
  secteurActivite:     string;
  tailleEntreprise:    TailleEntreprise;
  telephoneEntreprise: string;
  adresse:             string;
  ville:               string;
  pays:                string;
  siteWeb?:            string;
  nom:                 string;
  prenom:              string;
  email:               string;
  telephone:           string;
  motDePasse:          string;
}

export interface InscriptionFormState {
  nomEntreprise:       string;
  matriculeFiscale:    string;
  secteurActivite:     string;
  tailleEntreprise:    TailleEntreprise | '';
  telephoneEntreprise: string;
  adresse:             string;
  ville:               string;
  pays:                string;
  siteWeb:             string;
  nom:                 string;
  prenom:              string;
  email:               string;
  telephone:           string;
  motDePasse:          string;
  confirmMotDePasse:   string;
}

export const INITIAL_INSCRIPTION_STATE: InscriptionFormState = {
  nomEntreprise:       '',
  matriculeFiscale:    '',
  secteurActivite:     '',
  tailleEntreprise:    '',
  telephoneEntreprise: '',
  adresse:             '',
  ville:               '',
  pays:                'Tunisie',
  siteWeb:             '',
  nom:                 '',
  prenom:              '',
  email:               '',
  telephone:           '',
  motDePasse:          '',
  confirmMotDePasse:   '',
};