import apiClient from './axios.config';
import { ApiResponse } from '../types/auth.types';
import {
  EntrepriseCompteResponse,
  InscriptionEntrepriseRequest,
} from '../types/entreprise.types';

export const inscrireEntreprise = async (
  request: InscriptionEntrepriseRequest
): Promise<ApiResponse<EntrepriseCompteResponse>> => {
  const response = await apiClient.post<ApiResponse<EntrepriseCompteResponse>>(
    '/entreprises/inscription',
    request
  );
  return response.data;
};

export const consulterMonStatut = async (): Promise<ApiResponse<EntrepriseCompteResponse>> => {
  const response = await apiClient.get<ApiResponse<EntrepriseCompteResponse>>(
    '/entreprises/mon-compte/statut'
  );
  return response.data;
};