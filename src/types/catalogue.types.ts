/**
 * @file catalogue.types.ts
 * @description Types TypeScript pour le module Catalogue.
 *              Correspond aux DTOs backend CategorieRequest/Response et ProduitRequest/Response.
 * @author Riahi Dorsaf
 */

// ─────────────────────────────────────────────────────────────
// ÉNUMÉRATIONS
// ─────────────────────────────────────────────────────────────

/** Type de produit : service immatériel ou article physique stockable */
export type TypeProduit = 'SERVICE' | 'STOCKABLE';

/** Statut d'un produit dans le catalogue */
export type StatutProduit = 'ACTIF' | 'INACTIF' | 'ARCHIVE';

// ─────────────────────────────────────────────────────────────
// UNITÉS PRÉDÉFINIES PAR TYPE
// ─────────────────────────────────────────────────────────────

/** Unités de facturation pour les services */
export const UNITES_SERVICE: string[] = [
  'Forfait',
  'Heure',
  'Jour',
  'Session',
  'Mois',
  'Projet',
  'Autre',
];

/** Unités physiques pour les produits stockables */
export const UNITES_STOCKABLE: string[] = [
  'Pièce',
  'Boîte',
  'Kg',
  'Litre',
  'Mètre',
  'Lot',
  'Autre',
];

// ─────────────────────────────────────────────────────────────
// CATÉGORIES — RÉPONSE / REQUÊTE
// ─────────────────────────────────────────────────────────────

/** Réponse complète d'une catégorie retournée par le backend. */
export interface CategorieResponse {
  id:           number;
  nom:          string;
  description:  string | null;
  dateCreation: string;
  nbProduits:   number;
}

/** Corps de requête pour la création / modification d'une catégorie. */
export interface CategorieRequest {
  nom:          string;
  description?: string;
}

// ─────────────────────────────────────────────────────────────
// PRODUITS — RÉPONSE / REQUÊTE
// ─────────────────────────────────────────────────────────────

/**
 * Réponse complète d'un produit retournée par le backend.
 * prixTTC calculé via MapStruct côté backend.
 * enAlerte calculé côté service (stockDisponible <= stockMinimum).
 */
export interface ProduitResponse {
  id:               number;
  codeProduit:      string;
  nom:              string;
  description:      string | null;
  type:             TypeProduit;
  prixHT:           number;
  tauxTVA:          number | null;
  prixTTC:          number | null;
  unite:            string | null;
  stockDisponible:  number | null;
  /** Seuil d'alerte stock. Null pour les services. */
  stockMinimum:     number | null;
  /** true si le stock STOCKABLE est en alerte (stockDisponible <= stockMinimum). */
  enAlerte:         boolean;
  statut:           StatutProduit;
  categorieId:      number | null;
  categorieNom:     string | null;
  dateCreation:     string;
  dateModification: string | null;
}

/** Corps de requête pour la création / modification d'un produit. */
export interface ProduitRequest {
  nom:              string;
  description?:     string;
  type:             TypeProduit;
  prixHT:           number;
  tauxTVA?:         number;
  unite?:           string;
  stockDisponible?: number;
  /** Seuil d'alerte. Envoyé uniquement pour les produits STOCKABLE. */
  stockMinimum?:    number;
  categorieId?:     number;
  statut?:          StatutProduit;
}

// ─────────────────────────────────────────────────────────────
// ÉTAT FORMULAIRE PRODUIT (mobile)
// ─────────────────────────────────────────────────────────────

/**
 * État local du formulaire de création / modification d'un produit.
 * unite peut être une valeur prédéfinie ou une valeur libre ("Autre").
 */
export interface ProduitFormState {
  nom:             string;
  description:     string;
  type:            TypeProduit;
  prixHT:          string;
  tauxTVA:         string;
  unite:           string;
  /** 'Autre' si l'utilisateur a choisi de saisir une unité personnalisée */
  uniteAutre:      string;
  stockDisponible: string;
  /** Seuil d'alerte — uniquement pour STOCKABLE */
  stockMinimum:    string;
  categorieId:     number | null;
  statut:          StatutProduit;
}

/** Valeurs initiales du formulaire produit */
export const INITIAL_PRODUIT_FORM: ProduitFormState = {
  nom:             '',
  description:     '',
  type:            'SERVICE',
  prixHT:          '',
  tauxTVA:         '19',
  unite:           '',
  uniteAutre:      '',
  stockDisponible: '',
  stockMinimum:    '',
  categorieId:     null,
  statut:          'ACTIF',
};

// ─────────────────────────────────────────────────────────────
// ÉTAT FORMULAIRE CATÉGORIE (mobile)
// ─────────────────────────────────────────────────────────────

/** État local du formulaire catégorie. */
export interface CategorieFormState {
  nom:         string;
  description: string;
}

/** Valeurs initiales du formulaire catégorie */
export const INITIAL_CATEGORIE_FORM: CategorieFormState = {
  nom:         '',
  description: '',
};

// ─────────────────────────────────────────────────────────────
// FILTRES PRODUITS
// ─────────────────────────────────────────────────────────────

/** Paramètres de filtrage pour la liste produits. */
export interface ProduitFiltres {
  type?:        TypeProduit | 'TOUS';
  statut?:      StatutProduit | 'TOUS';
  categorieId?: number;
  keyword?:     string;
}

// ─────────────────────────────────────────────────────────────
// ICÔNES CATÉGORIES
// ─────────────────────────────────────────────────────────────

/**
 * Mapping nom de catégorie (mots-clés) → nom d'icône Ionicons.
 * Utilisé dans CatalogueScreen pour afficher une icône cohérente.
 */
export const CATEGORIE_ICONE_MAP: Record<string, string> = {
  logiciel:    'desktop-outline',
  software:    'desktop-outline',
  service:     'settings-outline',
  consulting:  'briefcase-outline',
  conseil:     'briefcase-outline',
  matériel:    'hardware-chip-outline',
  hardware:    'hardware-chip-outline',
  formation:   'school-outline',
  training:    'school-outline',
  marketing:   'megaphone-outline',
  finance:     'cash-outline',
  juridique:   'document-text-outline',
  legal:       'document-text-outline',
  sécurité:    'shield-checkmark-outline',
  santé:       'medkit-outline',
  transport:   'car-outline',
  agriculture: 'leaf-outline',
};

/** Icône par défaut si aucun mot-clé ne correspond */
export const CATEGORIE_ICONE_DEFAULT = 'grid-outline';