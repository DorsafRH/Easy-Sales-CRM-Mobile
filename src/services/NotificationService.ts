/**
 * @file NotificationService.ts
 * @description Service notifications locales — Compatible Expo Go SDK 53.
 *
 *   PROBLÈME : expo-notifications (push) a été retiré d'Expo Go avec SDK 53.
 *              Un import statique crashe immédiatement au démarrage.
 *
 *   SOLUTION : import dynamique (lazy) à l'intérieur des fonctions.
 *              → Expo Go : avertissement silencieux, app continue de fonctionner.
 *              → Development build / EAS build : toutes les notifs fonctionnent.
 *
 *   POUR TESTER LES NOTIFICATIONS :
 *              npx expo run:android   (development build local)
 *              ou créer un build EAS : eas build --profile development
 *
 * @author Riahi Dorsaf
 */

import { Platform } from 'react-native';

// ─────────────────────────────────────────────────────────────
// IMPORT DYNAMIQUE — évite le crash dans Expo Go SDK 53
// ─────────────────────────────────────────────────────────────

let _notificationsModule: any = null;
let _loadAttempted = false;

/**
 * Charge expo-notifications dynamiquement.
 * Retourne le module si disponible, null sinon (Expo Go).
 */
const getModule = async (): Promise<any | null> => {
  if (_loadAttempted) return _notificationsModule;
  _loadAttempted = true;
  try {
    _notificationsModule = await import('expo-notifications');
  } catch {
    console.warn(
      '[NotificationService] expo-notifications non disponible dans Expo Go SDK 53.\n' +
      'Les notifications locales fonctionneront dans un development build.\n' +
      'Commande : npx expo run:android',
    );
    _notificationsModule = null;
  }
  return _notificationsModule;
};

// ─────────────────────────────────────────────────────────────
// CONFIGURATION GLOBALE
// ─────────────────────────────────────────────────────────────

const createAndroidChannelIfNeeded = async (Notifications: any): Promise<void> => {
  if (Platform.OS !== 'android' || !Notifications.setNotificationChannelAsync) return;
  try {
    const channelId = 'reunions';
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Réunions CRM',
      importance: Notifications.AndroidImportance?.MAX ?? 5,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      enableLights: true,
    });
  } catch (e) {
    console.warn('[NotificationService] setNotificationChannelAsync error:', e);
  }
};

/**
 * Configure le comportement des notifications en foreground.
 * À appeler dans App.tsx au démarrage (useEffect).
 * Ne crashe pas dans Expo Go — log un avertissement silencieux.
 */
export const configureNotifications = (): void => {
  // Fire-and-forget : ne bloque pas le démarrage de l'app
  getModule().then(async Notifications => {
    if (!Notifications) return; // Expo Go → silencieux
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge:  false,
        }),
      });
      await createAndroidChannelIfNeeded(Notifications);
    } catch (e) {
      console.warn('[NotificationService] setNotificationHandler error:', e);
    }
  });
};

// ─────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────

export class NotificationService {

  /**
   * Demande la permission d'envoyer des notifications.
   * @returns true si accordée, false si refusée ou indisponible (Expo Go).
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    const Notifications = await getModule();
    if (!Notifications) return false; // Expo Go
    try {
      const { status, canAskAgain } = await Notifications.getPermissionsAsync();
      if (status === 'granted') return true;
      if (!canAskAgain) return false;
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      return newStatus === 'granted';
    } catch (e) {
      console.warn('[NotificationService] requestPermissions error:', e);
      return false;
    }
  }

  /**
   * Planifie les rappels locaux pour une réunion.
   * Une notification par valeur dans rappelsMinutes.
   *
   * ID unique : `reunion-{id}-{minutes}`
   *
   * @param reunionId       - ID de la réunion
   * @param titre           - Titre affiché
   * @param dateHeure       - ISO datetime de la réunion
   * @param rappelsMinutes  - Délais en minutes avant la réunion
   */
  static async scheduleReunionReminders(
    reunionId:      number,
    titre:          string,
    dateHeure:      string,
    rappelsMinutes: number[],
  ): Promise<void> {
    const Notifications = await getModule();
    if (!Notifications) return; // Expo Go → silencieux

    const hasPermission = await this.requestPermissions();
    if (!hasPermission || !rappelsMinutes?.length) return;

    const reunionDate = new Date(dateHeure);
    const now         = new Date();

    await createAndroidChannelIfNeeded(Notifications);
    const triggerType = Notifications.SchedulableTriggerInputTypes?.DATE ?? 'date';

    for (const minutes of rappelsMinutes) {
      const triggerDate = new Date(reunionDate.getTime() - minutes * 60 * 1000);
      if (triggerDate <= now) continue;

      const identifier = `reunion-${reunionId}-${minutes}`;
      try {
        await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
        await Notifications.scheduleNotificationAsync({
          identifier,
          content: {
            title: `📅 Réunion dans ${minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h`}`,
            body:  titre,
            sound: true,
            data:  { reunionId, type: 'REUNION_RAPPEL' },
            channelId: 'reunions',
          },
          trigger: {
            type: triggerType,
            date: triggerDate,
          },
        });
      } catch (e) {
        console.warn(`[NotificationService] Schedule error ${identifier}:`, e);
      }
    }
  }

  /**
   * Annule toutes les notifications d'une réunion (par rappelsMinutes connus).
   */
  static async cancelReunionReminders(
    reunionId:      number,
    rappelsMinutes: number[],
  ): Promise<void> {
    const Notifications = await getModule();
    if (!Notifications || !rappelsMinutes?.length) return;
    for (const minutes of rappelsMinutes) {
      const identifier = `reunion-${reunionId}-${minutes}`;
      await Notifications.cancelScheduledNotificationAsync(identifier).catch(() => {});
    }
  }

  /**
   * Annule toutes les notifications d'une réunion en cherchant par préfixe.
   * Utile quand on ne connaît pas les rappelsMinutes.
   */
  static async cancelAllRemindersForReunion(reunionId: number): Promise<void> {
    const Notifications = await getModule();
    if (!Notifications) return;
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      const prefix    = `reunion-${reunionId}-`;
      for (const notif of scheduled) {
        if (notif.identifier.startsWith(prefix)) {
          await Notifications.cancelScheduledNotificationAsync(notif.identifier).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('[NotificationService] cancelAll error:', e);
    }
  }
}