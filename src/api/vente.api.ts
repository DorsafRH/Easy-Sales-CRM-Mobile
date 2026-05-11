/**
 * @file vente.api.ts
 * @description Fonctions d'appel API pour le module Ventes Sprint 3.
 *              Leads, Opportunites, Devis, Factures, ActivitesCommerciales.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  LeadResponse,
  LeadRequest,
  StatutLead,
  OpportuniteResponse,
  OpportuniteRequest,
  StatutOpportunite,
  KanbanData,
  DevisRequest,
  DevisResponse,
  StatutDevis,
  FactureResponse,
  StatutFacture,
  ActiviteCommercialeResponse,
  ActiviteCommercialeRequest,
  PipelineKpiResponse,
} from '../types/vente.types';

// ─────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────

export const listerLeads = async (
  statut?: StatutLead,
  keyword?: string,
): Promise<ApiResponse<LeadResponse[]>> => {
  const params: Record<string, string> = {};
  if (statut)           params.statut  = statut;
  if (keyword?.trim())  params.keyword = keyword.trim();
  const res = await apiClient.get<ApiResponse<LeadResponse[]>>('/leads', { params });
  return res.data;
};

export const obtenirLead = async (
  id: number,
): Promise<ApiResponse<LeadResponse>> => {
  const res = await apiClient.get<ApiResponse<LeadResponse>>(`/leads/${id}`);
  return res.data;
};

export const creerLead = async (
  request: LeadRequest,
): Promise<ApiResponse<LeadResponse>> => {
  const res = await apiClient.post<ApiResponse<LeadResponse>>('/leads', request);
  return res.data;
};

export const modifierLead = async (
  id: number,
  request: LeadRequest,
): Promise<ApiResponse<LeadResponse>> => {
  const res = await apiClient.put<ApiResponse<LeadResponse>>(`/leads/${id}`, request);
  return res.data;
};

export const changerStatutLead = async (
  id: number,
  statut: StatutLead,
  raisonPerte?: string,
): Promise<ApiResponse<LeadResponse>> => {
  const params: Record<string, string> = { statut };
  if (raisonPerte) params.raisonPerte = raisonPerte;
  const res = await apiClient.patch<ApiResponse<LeadResponse>>(
    `/leads/${id}/statut`,
    null,
    { params },
  );
  return res.data;
};

export const convertirLead = async (
  id: number,
  options: {
    clientExistantId?:  number;
    creerNouveauClient?: boolean;
    titreOpportunite?:   string;
  },
): Promise<ApiResponse<OpportuniteResponse>> => {
  const params: Record<string, string | number | boolean> = {};

  if (options.clientExistantId)              params.clientExistantId  = options.clientExistantId;
  if (options.creerNouveauClient !== undefined) params.creerNouveauClient = options.creerNouveauClient;
  if (options.titreOpportunite)              params.titreOpportunite  = options.titreOpportunite;
  const res = await apiClient.post<ApiResponse<OpportuniteResponse>>(
    `/leads/${id}/convertir`,
    null,
    { params },
  );
  return res.data;
};

export const supprimerLead = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(`/leads/${id}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// OPPORTUNITÉS
// ─────────────────────────────────────────────────────────────

export const listerOpportunites = async (
  statut?: StatutOpportunite,
  keyword?: string,
): Promise<ApiResponse<OpportuniteResponse[]>> => {
  const params: Record<string, string> = {};
  if (statut)          params.statut  = statut;
  if (keyword?.trim()) params.keyword = keyword.trim();
  const res = await apiClient.get<ApiResponse<OpportuniteResponse[]>>(
    '/opportunites',
    { params },
  );
  return res.data;
};

export const obtenirKanban = async (): Promise<ApiResponse<KanbanData>> => {
  const res = await apiClient.get<ApiResponse<KanbanData>>('/opportunites/kanban');
  return res.data;
};

export const obtenirOpportunite = async (
  id: number,
): Promise<ApiResponse<OpportuniteResponse>> => {
  const res = await apiClient.get<ApiResponse<OpportuniteResponse>>(`/opportunites/${id}`);
  return res.data;
};

export const creerOpportunite = async (
  request: OpportuniteRequest,
): Promise<ApiResponse<OpportuniteResponse>> => {
  const res = await apiClient.post<ApiResponse<OpportuniteResponse>>('/opportunites', request);
  return res.data;
};

export const modifierOpportunite = async (
  id: number,
  request: OpportuniteRequest,
): Promise<ApiResponse<OpportuniteResponse>> => {
  const res = await apiClient.put<ApiResponse<OpportuniteResponse>>(
    `/opportunites/${id}`,
    request,
  );
  return res.data;
};

export const changerStatutOpportunite = async (
  id: number,
  statut: StatutOpportunite,
  raisonPerte?: string,
): Promise<ApiResponse<OpportuniteResponse>> => {
  const params: Record<string, string> = { statut };
  if (raisonPerte) params.raisonPerte = raisonPerte;
  const res = await apiClient.patch<ApiResponse<OpportuniteResponse>>(
    `/opportunites/${id}/statut`,
    null,
    { params },
  );
  return res.data;
};

export const genererDevisDepuisOpportunite = async (
  id: number,
): Promise<ApiResponse<DevisResponse>> => {
  const res = await apiClient.post<ApiResponse<DevisResponse>>(
    `/opportunites/${id}/generer-devis`,
  );
  return res.data;
};

export const supprimerOpportunite = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(`/opportunites/${id}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// DEVIS
// ─────────────────────────────────────────────────────────────

export const listerDevis = async (
  statut?: StatutDevis,
): Promise<ApiResponse<DevisResponse[]>> => {
  const params: Record<string, string> = {};
  if (statut) params.statut = statut;
  const res = await apiClient.get<ApiResponse<DevisResponse[]>>('/devis', { params });
  return res.data;
};

export const obtenirDevis = async (
  id: number,
): Promise<ApiResponse<DevisResponse>> => {
  const res = await apiClient.get<ApiResponse<DevisResponse>>(`/devis/${id}`);
  return res.data;
};

export const creerDevis = async (
  request: DevisRequest,
): Promise<ApiResponse<DevisResponse>> => {
  const res = await apiClient.post<ApiResponse<DevisResponse>>('/devis', request);
  return res.data;
};

export const modifierDevis = async (
  id: number,
  request: DevisRequest,
): Promise<ApiResponse<DevisResponse>> => {
  const res = await apiClient.put<ApiResponse<DevisResponse>>(`/devis/${id}`, request);
  return res.data;
};

export const changerStatutDevis = async (
  id: number,
  statut: StatutDevis,
): Promise<ApiResponse<DevisResponse>> => {
  const res = await apiClient.patch<ApiResponse<DevisResponse>>(
    `/devis/${id}/statut`,
    null,
    { params: { statut } },
  );
  return res.data;
};

export const convertirDevisEnFacture = async (
  id: number,
): Promise<ApiResponse<FactureResponse>> => {
  const res = await apiClient.post<ApiResponse<FactureResponse>>(
    `/devis/${id}/convertir-en-facture`,
  );
  return res.data;
};

export const supprimerDevis = async (
  id: number,
): Promise<ApiResponse<void>> => {
  const res = await apiClient.delete<ApiResponse<void>>(`/devis/${id}`);
  return res.data;
};

// ─────────────────────────────────────────────────────────────
// FACTURES
// ─────────────────────────────────────────────────────────────

export const listerFactures = async (
  statut?: StatutFacture,
): Promise<ApiResponse<FactureResponse[]>> => {
  const params: Record<string, string> = {};
  if (statut) params.statut = statut;
  const res = await apiClient.get<ApiResponse<FactureResponse[]>>('/factures', { params });
  return res.data;
};

export const obtenirFacture = async (
  id: number,
): Promise<ApiResponse<FactureResponse>> => {
  const res = await apiClient.get<ApiResponse<FactureResponse>>(`/factures/${id}`);
  return res.data;
};

export const changerStatutFacture = async (
  id: number,
  statut: StatutFacture,
): Promise<ApiResponse<FactureResponse>> => {
  const res = await apiClient.patch<ApiResponse<FactureResponse>>(
    `/factures/${id}/statut`,
    null,
    { params: { statut } },
  );
  return res.data;
};