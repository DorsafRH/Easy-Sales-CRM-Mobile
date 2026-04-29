/**
 * @file catalogue.api.ts
 * @description Fonctions d'appel API pour le catalogue (catégories + produits).
 *              Tous les endpoints nécessitent ROLE_PROPRIETAIRE (JWT Bearer).
 *              Base path backend : /api/catalogue
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  CategorieRequest,
  CategorieResponse,
  ProduitRequest,
  ProduitResponse,
  StatutProduit,
  TypeProduit,
} from '../types/catalogue.types';

// ═════════════════════════════════════════════════════════════
// CATÉGORIES — /api/catalogue/categories
// ═════════════════════════════════════════════════════════════

/**
 * Récupère la liste des catégories du propriétaire connecté.
 *
 * @param keyword - Recherche sur nom et description (optionnel)
 * @returns Liste des catégories avec nbProduits enrichi
 * @author Riahi Dorsaf
 */
export const listerCategories = async (
  keyword?: string,
): Promise<ApiResponse<CategorieResponse[]>> => {
  const params: Record<string, string> = {};
  if (keyword?.trim()) params.keyword = keyword.trim();

  const response = await apiClient.get<ApiResponse<CategorieResponse[]>>(
    '/catalogue/categories',
    { params },
  );
  return response.data;
};

/**
 * Crée une nouvelle catégorie.
 *
 * @param request - Nom et description de la catégorie
 * @returns Catégorie créée
 * @author Riahi Dorsaf
 */
export const creerCategorie = async (
  request: CategorieRequest,
): Promise<ApiResponse<CategorieResponse>> => {
  const response = await apiClient.post<ApiResponse<CategorieResponse>>(
    '/catalogue/categories',
    request,
  );
  return response.data;
};

/**
 * Modifie une catégorie existante.
 *
 * @param id      - Identifiant de la catégorie
 * @param request - Nouvelles données
 * @returns Catégorie mise à jour
 * @author Riahi Dorsaf
 */
export const modifierCategorie = async (
  id: number,
  request: CategorieRequest,
): Promise<ApiResponse<CategorieResponse>> => {
  const response = await apiClient.put<ApiResponse<CategorieResponse>>(
    `/catalogue/categories/${id}`,
    request,
  );
  return response.data;
};

/**
 * Supprime une catégorie.
 * Règle backend : impossible si la catégorie contient des produits actifs.
 *
 * @param id - Identifiant de la catégorie à supprimer
 * @author Riahi Dorsaf
 */
export const supprimerCategorie = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/catalogue/categories/${id}`,
  );
  return response.data;
};

// ═════════════════════════════════════════════════════════════
// PRODUITS — /api/catalogue/produits
// ═════════════════════════════════════════════════════════════

/**
 * Récupère la liste des produits avec filtres optionnels.
 *
 * @param type        - Filtre par type : 'SERVICE' | 'STOCKABLE' (optionnel)
 * @param statut      - Filtre par statut : 'ACTIF' | 'INACTIF' | 'ARCHIVE' (optionnel)
 * @param categorieId - Filtre par catégorie (optionnel)
 * @param keyword     - Recherche sur nom et description (optionnel)
 * @returns Liste des produits filtrés
 * @author Riahi Dorsaf
 */
export const listerProduits = async (
  type?: TypeProduit,
  statut?: StatutProduit,
  categorieId?: number,
  keyword?: string,
): Promise<ApiResponse<ProduitResponse[]>> => {
  const params: Record<string, string | number> = {};
  if (type)        params.type        = type;
  if (statut)      params.statut      = statut;
  if (categorieId) params.categorieId = categorieId;
  if (keyword?.trim()) params.keyword = keyword.trim();

  const response = await apiClient.get<ApiResponse<ProduitResponse[]>>(
    '/catalogue/produits',
    { params },
  );
  return response.data;
};

/**
 * Récupère le détail complet d'un produit.
 *
 * @param id - Identifiant du produit
 * @returns Produit avec prixTTC calculé et infos catégorie
 * @author Riahi Dorsaf
 */
export const obtenirProduit = async (
  id: number,
): Promise<ApiResponse<ProduitResponse>> => {
  const response = await apiClient.get<ApiResponse<ProduitResponse>>(
    `/catalogue/produits/${id}`,
  );
  return response.data;
};

/**
 * Crée un nouveau produit dans le catalogue.
 * Le code produit (PRD-YYYY-NNNN) est généré automatiquement côté backend.
 *
 * @param request - Données du produit à créer
 * @returns Produit créé avec son codeProduit généré
 * @author Riahi Dorsaf
 */
export const creerProduit = async (
  request: ProduitRequest,
): Promise<ApiResponse<ProduitResponse>> => {
  const response = await apiClient.post<ApiResponse<ProduitResponse>>(
    '/catalogue/produits',
    request,
  );
  return response.data;
};

/**
 * Modifie un produit existant.
 *
 * @param id      - Identifiant du produit à modifier
 * @param request - Nouvelles données du produit
 * @returns Produit mis à jour
 * @author Riahi Dorsaf
 */
export const modifierProduit = async (
  id: number,
  request: ProduitRequest,
): Promise<ApiResponse<ProduitResponse>> => {
  const response = await apiClient.put<ApiResponse<ProduitResponse>>(
    `/catalogue/produits/${id}`,
    request,
  );
  return response.data;
};

/**
 * Archive un produit (statut → ARCHIVE).
 * Un produit archivé n'apparaît plus dans les filtres par défaut.
 *
 * @param id - Identifiant du produit à archiver
 * @author Riahi Dorsaf
 */
export const archiverProduit = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.patch<ApiResponse<void>>(
    `/catalogue/produits/${id}/archiver`,
  );
  return response.data;
};