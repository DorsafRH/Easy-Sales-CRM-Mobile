/**
 * @file useTimeline.ts
 * @description Hook de récupération de la timeline d'activités pour une entité donnée.
 *              Appelle GET /reporting/activites (toutes activités du propriétaire)
 *              et filtre côté mobile par entiteType + entiteId.
 * @author Riahi Dorsaf
 */

import { useState, useCallback } from 'react';
import { useFocusEffect }        from '@react-navigation/native';

import * as ReportingApi     from '../api/reporting.api';
import { ActiviteResponse }  from '../types/reporting.types';

// ─────────────────────────────────────────────────────────────

/**
 * Récupère et filtre les activités de reporting pour une entité.
 *
 * @param entiteType - Type de l'entité (ex: 'LEAD', 'OPPORTUNITE', 'CLIENT'…)
 * @param entiteId   - Identifiant de l'entité
 */
export const useTimeline = (entiteType: string, entiteId: number) => {
  const [activites, setActivites] = useState<ActiviteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const charger = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await ReportingApi.getActivites(0, 50);
      if (res.success) {
        const filtrees = res.data.content.filter(
          (a) =>
            (a.entiteType as string) === entiteType &&
            a.entiteId === entiteId,
        );
        setActivites(filtrees);
      }
    } catch {
      // silencieux
    } finally {
      setIsLoading(false);
    }
  }, [entiteType, entiteId]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  return { activites, isLoading };
};
