/**
 * @file vente.utils.ts
 * @description Fonctions utilitaires partagees pour le module Ventes.
 *              Calcul CA, formatage montants.
 * @author Riahi Dorsaf
 */

import { FactureResponse } from '../types/vente.types';

/**
 * Calcule le chiffre d'affaires depuis la liste des factures.
 * Seules les factures au statut PAYEE sont incluses.
 */
export const calculerCA = (factures: FactureResponse[]): number =>
  factures
    .filter(f => f.statut === 'PAYEE')
    .reduce((sum, f) => sum + (f.montantTtc ?? 0), 0);

/**
 * Formate un montant en TND avec separateur de milliers.
 */
export const formaterMontant = (montant: number): string =>
  montant.toLocaleString('fr-FR', { maximumFractionDigits: 0 }) + ' TND';
