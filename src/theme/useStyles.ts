/**
 * @file useStyles.ts
 * @description Hook générique mémoïsé pour la création de styles.
 *
 *              PROBLÈME QU'ON RÉSOUT :
 *              En React Native, StyleSheet.create() est appelé à chaque
 *              rendu du composant si on le met directement dedans.
 *              Avec 50+ composants et des listes de données, ça crée
 *              des milliers de recalculs inutiles → lag, 60fps non atteints.
 *
 *              SOLUTION — useMemo + StyleSheet.create :
 *              On mémoïse le résultat de StyleSheet.create().
 *              Il n'est recalculé QUE SI le thème change (light ↔ dark).
 *              Dans tous les autres cas (scroll, saisie, navigation),
 *              React réutilise le résultat déjà calculé en mémoire.
 *
 *              PATTERN UTILISÉ :
 *              Chaque écran a un fichier NomEcran.styles.ts qui exporte
 *              une fonction makeStyles. Ce hook prend cette fonction,
 *              lui injecte le thème, et retourne les styles mémoïsés.
 *
 *              USAGE :
 *              // Dans NomEcran.styles.ts
 *              export const makeStyles = (theme: AppTheme) => ({
 *                container: { backgroundColor: theme.colors.bgApp }
 *              });
 *
 *              // Dans NomEcran.tsx
 *              const styles = useStyles(makeStyles);
 *              // styles.container est mémoïsé et typé automatiquement
 *
 * @author Riahi Dorsaf
 */

import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './themeStore';
import { AppTheme } from './theme.types';

// ─────────────────────────────────────────────────────────────
// TYPE DE LA FONCTION FACTORY
// ─────────────────────────────────────────────────────────────

/**
 * Type générique d'une fonction de fabrique de styles.
 *
 * T extends StyleSheet.NamedStyles<T> signifie que T doit être
 * un objet dont les valeurs sont des objets de style React Native.
 * TypeScript infère automatiquement T depuis la fonction passée
 * à useStyles() — pas besoin de le spécifier manuellement.
 *
 * @template T - Type de l'objet de styles retourné
 * @param theme - Thème courant injecté automatiquement
 * @returns Objet de styles compatible StyleSheet.create()
 *
 * @example
 * const makeStyles: StyleFactory<typeof makeStyles> = (theme) => ({
 *   title: { color: theme.colors.textPrimary }
 * });
 */
export type StyleFactory<T extends StyleSheet.NamedStyles<T>> =
  (theme: AppTheme) => T;

// ─────────────────────────────────────────────────────────────
// HOOK PRINCIPAL
// ─────────────────────────────────────────────────────────────

/**
 * Hook générique mémoïsé pour créer des styles liés au thème.
 *
 * FONCTIONNEMENT INTERNE :
 * 1. Récupère le thème courant via useTheme() (Zustand)
 * 2. useMemo vérifie si [theme, factory] ont changé
 * 3. Si non → retourne le StyleSheet déjà en mémoire (0 recalcul)
 * 4. Si oui → appelle factory(theme) et crée un nouveau StyleSheet
 *
 * AVANTAGES :
 * - Performance : StyleSheet.create() n'est pas appelé à chaque rendu
 * - Type-safe : TypeScript connaît toutes les clés de styles
 * - Thème automatique : pas besoin d'importer useTheme() dans chaque écran
 * - Cohérence : un seul endroit pour créer des styles dans toute l'app
 *
 * @template T - Type inféré automatiquement depuis factory
 * @param factory - Fonction (theme) => objet de styles
 * @returns StyleSheet mémoïsé, recalculé uniquement si le thème change
 *
 * @example
 * // LoginScreen.styles.ts
 * export const makeStyles = (theme: AppTheme) => ({
 *   container: {
 *     flex: 1,
 *     backgroundColor: theme.colors.bgApp,
 *     paddingHorizontal: theme.spacing[5],
 *   },
 *   title: {
 *     fontSize: theme.typography.size.xl,
 *     color: theme.colors.textPrimary,
 *     fontWeight: '700' as const,
 *   },
 * });
 *
 * // LoginScreen.tsx
 * const LoginScreen = () => {
 *   const styles = useStyles(makeStyles);
 *   // styles.container → { flex: 1, backgroundColor: '#F3F4F6', ... }
 *   // styles.title     → { fontSize: 22, color: '#111827', ... }
 * };
 */
export const useStyles = <T extends StyleSheet.NamedStyles<T>>(
  factory: StyleFactory<T>,
): T => {
  // Récupère le thème courant depuis le store Zustand
  const theme = useTheme();

  /**
   * useMemo mémoïse le résultat de StyleSheet.create(factory(theme)).
   * Le tableau [theme, factory] contient les dépendances :
   * - Si theme change (light ↔ dark) → recalcul
   * - Si factory change → recalcul (ne change jamais en pratique)
   * - Dans tous les autres cas → réutilise le résultat en mémoire
   */
  return useMemo(
    () => StyleSheet.create(factory(theme)),
    [theme, factory],
  );
};