/**
 * @file marketing-stats.api.ts
 * @description Fonctions d'appel API pour le dashboard statistiques marketing.
 * @author Riahi Dorsaf
 */

import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import { MarketingOverview, TopPostReactions } from '../types/marketing.types';

/** Vue d'ensemble du dashboard marketing (leads, publications, engagement). */
export const getOverview = async (): Promise<ApiResponse<MarketingOverview>> =>
  (await apiClient.get<ApiResponse<MarketingOverview>>('/marketing/stats/overview')).data;

/** Publications les plus engageantes. */
export const getTopPosts = async (): Promise<ApiResponse<TopPostReactions[]>> =>
  (await apiClient.get<ApiResponse<TopPostReactions[]>>('/marketing/stats/top-posts')).data;
