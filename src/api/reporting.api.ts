/**
 * @file reporting.api.ts
 * @description Fonctions d'appel API pour le module Reporting / Dashboard.
 *              Nécessite ROLE_PROPRIETAIRE (JWT Bearer).
 *              Base path backend : /api/reporting
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import { ReportingKpisResponse } from '../types/reporting.types';

/**
 * Récupère les KPIs du tableau de bord pour le propriétaire connecté.
 *
 * Sprint 2 :
 * - nbClients : nombre réel de clients actifs
 * - nbOpportunites, chiffreAffaires, nbDevis : 0 (câblés Sprint 3)
 * - sparkline : [0, 0, 0, 0, 0, 0, 0]
 * - activiteRecente : 5 derniers clients créés
 *
 * @returns KPIs et activité récente du propriétaire
 * @author Riahi Dorsaf
 */
export const getKpis = async (): Promise<ApiResponse<ReportingKpisResponse>> => {
  const response = await apiClient.get<ApiResponse<ReportingKpisResponse>>(
    '/reporting/kpis',
  );
  return response.data;
};