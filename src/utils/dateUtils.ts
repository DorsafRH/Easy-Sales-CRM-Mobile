/**
 * @file dateUtils.ts
 * @description Utilitaires de formatage de date timezone-safe.
 *              NE PAS utiliser toISOString() pour des dates locales —
 *              toISOString() convertit en UTC et provoque un décalage horaire.
 * @author Riahi Dorsaf
 */

const pad = (n: number): string => String(n).padStart(2, '0');

/**
 * Formate une Date en "YYYY-MM-DDTHH:mm:ss" en heure LOCALE.
 * Compatible avec le format attendu par Spring Boot (LocalDateTime).
 *
 * @example toLocalDateTimeString(new Date()) → "2025-05-09T14:00:00"
 */
export const toLocalDateTimeString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
  `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/**
 * Formate une Date en "YYYY-MM-DD" en heure LOCALE.
 * Évite le bug toISOString() qui peut retourner le jour précédent après minuit UTC.
 *
 * @example toLocalDateString(new Date()) → "2025-05-09"
 */
export const toLocalDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/**
 * Parse une chaîne "YYYY-MM-DDTHH:mm:ss" en Date locale.
 * Cette fonction évite les conversions UTC implicites de new Date(string).
 */
export const parseLocalDateTime = (value: string): Date => {
  const [datePart, timePart = '00:00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};