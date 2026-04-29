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
 * @author Riahi Dorsaf
 */
export const listerCategories = async (
  keyword?: string,
): Promise<ApiResponse<CategorieResponse[]>> => {
  const params: Record<string, string> = {};
  if (keyword?.trim()) params.keyword = keyword.trim();
  const response = await apiClient.get<ApiResponse<CategorieResponse[]>>(
    '/catalogue/categories', { params },
  );
  return response.data;
};

/**
 * Crée une nouvelle catégorie.
 * @author Riahi Dorsaf
 */
export const creerCategorie = async (
  request: CategorieRequest,
): Promise<ApiResponse<CategorieResponse>> => {
  const response = await apiClient.post<ApiResponse<CategorieResponse>>(
    '/catalogue/categories', request,
  );
  return response.data;
};

/**
 * Modifie une catégorie existante.
 * @author Riahi Dorsaf
 */
export const modifierCategorie = async (
  id: number,
  request: CategorieRequest,
): Promise<ApiResponse<CategorieResponse>> => {
  const response = await apiClient.put<ApiResponse<CategorieResponse>>(
    `/catalogue/categories/${id}`, request,
  );
  return response.data;
};

/**
 * Désactive tous les produits actifs d'une catégorie (statut → INACTIF).
 * À appeler avant {@link supprimerCategorie} quand la catégorie
 * contient des produits actifs.
 *
 * Correspond à : PATCH /catalogue/categories/{id}/desactiver-produits
 *
 * @param id - Identifiant de la catégorie
 * @author Riahi Dorsaf
 */
export const desactiverProduitsCategorie = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.patch<ApiResponse<void>>(
    `/catalogue/categories/${id}/desactiver-produits`,
  );
  return response.data;
};

/**
 * Retire la catégorie de tous ses produits (categorieId → null).
 * Les produits restent actifs mais sans catégorie.
 * À appeler avant {@link supprimerCategorie} quand la catégorie
 * contient des produits actifs.
 *
 * Correspond à : PATCH /catalogue/categories/{id}/retirer-categorie
 *
 * @param id - Identifiant de la catégorie
 * @author Riahi Dorsaf
 */
export const retirerCategorieProduits = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.patch<ApiResponse<void>>(
    `/catalogue/categories/${id}/retirer-categorie`,
  );
  return response.data;
};

/**
 * Supprime une catégorie sans produits actifs.
 * Retourne 400 si la catégorie contient encore des produits actifs.
 * Dans ce cas, appeler d'abord {@link desactiverProduitsCategorie}
 * ou {@link retirerCategorieProduits}.
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
 * @author Riahi Dorsaf
 */
export const listerProduits = async (
  type?: TypeProduit,
  statut?: StatutProduit,
  categorieId?: number,
  keyword?: string,
): Promise<ApiResponse<ProduitResponse[]>> => {
  const params: Record<string, string | number> = {};
  if (type)            params.type        = type;
  if (statut)          params.statut      = statut;
  if (categorieId)     params.categorieId = categorieId;
  if (keyword?.trim()) params.keyword     = keyword.trim();
  const response = await apiClient.get<ApiResponse<ProduitResponse[]>>(
    '/catalogue/produits', { params },
  );
  return response.data;
};

/**
 * Récupère le détail complet d'un produit.
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
 * @author Riahi Dorsaf
 */
export const creerProduit = async (
  request: ProduitRequest,
): Promise<ApiResponse<ProduitResponse>> => {
  const response = await apiClient.post<ApiResponse<ProduitResponse>>(
    '/catalogue/produits', request,
  );
  return response.data;
};

/**
 * Modifie un produit existant.
 * @author Riahi Dorsaf
 */
export const modifierProduit = async (
  id: number,
  request: ProduitRequest,
): Promise<ApiResponse<ProduitResponse>> => {
  const response = await apiClient.put<ApiResponse<ProduitResponse>>(
    `/catalogue/produits/${id}`, request,
  );
  return response.data;
};

/**
 * Archive un produit (statut → ARCHIVE).
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