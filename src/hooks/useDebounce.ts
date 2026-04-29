/**
 * @file useDebounce.ts
 * @description Hook générique de debounce pour différer une valeur.
 *
 *              POURQUOI LE DEBOUNCE ?
 *              Sans debounce, chaque frappe clavier déclenche un appel API.
 *              Pour "InnoTech", ça fait 8 appels : /clients?keyword=I,
 *              /clients?keyword=In, /clients?keyword=Inn, etc.
 *              Avec un debounce de 400ms, on attend que l'utilisateur
 *              arrête de taper pendant 400ms avant de lancer la requête.
 *
 *              UTILISATION :
 *              const debouncedSearch = useDebounce(searchText, 400);
 *              useEffect(() => {
 *                if (debouncedSearch !== undefined) fetchClients(debouncedSearch);
 *              }, [debouncedSearch]);
 *
 * @author Riahi Dorsaf
 */

import { useState, useEffect } from 'react';

/**
 * Retarde la propagation d'une valeur jusqu'à ce qu'elle soit stable
 * pendant le délai spécifié.
 *
 * @template T - Type de la valeur à debouncer
 * @param value - Valeur réactive à debouncer
 * @param delay - Délai en millisecondes (défaut : 400ms)
 * @returns Valeur debouncée — mise à jour uniquement après le délai
 * @author Riahi Dorsaf
 */
export const useDebounce = <T>(value: T, delay = 400): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Programme la mise à jour après le délai
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Annule le timer si la valeur change avant la fin du délai
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};