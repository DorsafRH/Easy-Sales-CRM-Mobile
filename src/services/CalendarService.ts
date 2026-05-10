/**
 * @file CalendarService.ts
 * @description Service de synchronisation avec le calendrier natif.
 *              Utilise expo-calendar pour :
 *              1. Lire les événements du jour (affichage des conflits dans PlanifierReunion)
 *              2. Ajouter une réunion CRM dans le calendrier natif après création
 *
 *              INSTALLATION REQUISE :
 *                expo install expo-calendar
 *
 *              USAGE dans PlanifierReunionScreen :
 *                // Charger les events natifs du jour sélectionné :
 *                const events = await CalendarService.getEventsForDay(new Date(dateSelectionnee));
 *
 *                // Après création de la réunion :
 *                await CalendarService.addReunionToCalendar(reunionCreee);
 *
 * @author Riahi Dorsaf
 */

import * as Calendar from 'expo-calendar';
import { Platform }  from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReunionResponse } from '../types/reunion.types';
import { parseLocalDateTime } from '../utils/dateUtils';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface NativeCalendarEvent {
  id:       string;
  title:    string;
  start:    Date;
  end:      Date;
  location: string;
  isCrm:    boolean; // true si l'event a été créé par Easy Sales CRM
}

// ─────────────────────────────────────────────────────────────
// SERVICE
// ─────────────────────────────────────────────────────────────

export class CalendarService {

  /**
   * Demande les permissions d'accès au calendrier natif.
   * @returns true si l'accès est accordé
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'web') return false;
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Récupère les événements du calendrier natif pour un jour donné.
   * Utile dans PlanifierReunionScreen pour afficher les conflits potentiels.
   *
   * @param date - La date pour laquelle on veut les événements
   * @returns Liste des événements natifs pour ce jour
   */
  static async getEventsForDay(date: Date): Promise<NativeCalendarEvent[]> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return [];

    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const calendarIds = calendars.map(c => c.id);

      if (calendarIds.length === 0) return [];

      const events = await Calendar.getEventsAsync(calendarIds, startOfDay, endOfDay);

      return events.map(e => ({
        id:       e.id,
        title:    e.title || 'Sans titre',
        start:    new Date(e.startDate),
        end:      new Date(e.endDate),
        location: e.location ?? '',
        isCrm:    e.notes?.includes('[EasySalesCRM]') ?? false,
      }));
    } catch (e) {
      console.warn('[CalendarService] Erreur getEventsForDay:', e);
      return [];
    }
  }

  private static STORAGE_PREFIX = 'crm_reunion_calendar_event_id:';

  private static async getStoredEventId(reunionId: number): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${this.STORAGE_PREFIX}${reunionId}`);
    } catch (e) {
      console.warn('[CalendarService] Erreur lecture storage eventId:', e);
      return null;
    }
  }

  private static async setStoredEventId(reunionId: number, eventId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.STORAGE_PREFIX}${reunionId}`, eventId);
    } catch (e) {
      console.warn('[CalendarService] Erreur écriture storage eventId:', e);
    }
  }

  private static async removeStoredEventId(reunionId: number): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.STORAGE_PREFIX}${reunionId}`);
    } catch (e) {
      console.warn('[CalendarService] Erreur suppression storage eventId:', e);
    }
  }

  private static async getWritableCalendar(): Promise<Calendar.Calendar | null> {
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    if (calendars.length === 0) return null;

    const defaultCalendar = await this.getDefaultCalendarSafely();
    if (defaultCalendar) return defaultCalendar;

    const modifiable = calendars.find(c => c.allowsModifications);
    return modifiable ?? calendars[0];
  }

  private static async getDefaultCalendarSafely(): Promise<Calendar.Calendar | null> {
    if (Platform.OS === 'ios') {
      try {
        return await Calendar.getDefaultCalendarAsync();
      } catch {
        // Safari / Expo Go iOS possible, fallback below.
      }
    }
    return null;
  }

  private static async getOrCreateCrmCalendar(): Promise<string | null> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const existing = calendars.find(c => c.title === 'Easy Sales CRM');
      if (existing) return existing.id;

      const writable = await this.getWritableCalendar();
      if (!writable) {
        console.warn('[CalendarService] Aucun calendrier modifiable trouvé.');
        return null;
      }

      try {
        const createOptions: any = {
          title:        'Easy Sales CRM',
          color:        '#2563EB',
          entityType:   Calendar.EntityTypes.EVENT,
          name:         'easysalescrm',
          ownerAccount: writable.ownerAccount ?? 'personal',
          accessLevel:  Calendar.CalendarAccessLevel.OWNER,
        };

        if (writable.source?.id) {
          createOptions.sourceId = writable.source.id;
        }
        if (writable.source) {
          createOptions.source = writable.source;
        }

        const crmCalendarId = await Calendar.createCalendarAsync(createOptions);
        return crmCalendarId;
      } catch (e) {
        console.warn('[CalendarService] Impossible de créer le calendrier CRM, utilisation du calendrier modifiable existant.', e);
        return writable.id;
      }
    } catch (e) {
      console.warn('[CalendarService] Impossible de créer/trouver le calendrier CRM:', e);
      return null;
    }
  }

  /**
   * Ajoute ou met à jour une réunion CRM dans le calendrier natif de l'appareil.
   * L'événement est marqué avec [EasySalesCRM] dans les notes pour
   * pouvoir le retrouver et le mettre à jour/supprimer plus tard.
   *
   * @param reunion - La réunion à ajouter au calendrier
   * @returns L'ID de l'événement créé ou mis à jour dans le calendrier natif, ou null
   */
  static async addReunionToCalendar(reunion: ReunionResponse): Promise<string | null> {
    const hasPermission = await Calendar.requestCalendarPermissionsAsync()
      .then(r => r.status === 'granted');
    if (!hasPermission) return null;

    const calendarId = await this.getOrCreateCrmCalendar();
    if (!calendarId) return null;

    const startDate = parseLocalDateTime(reunion.dateHeure);
    const endDate = new Date(startDate.getTime() + reunion.dureeMinutes * 60 * 1000);

    const eventData: any = {
      title:    reunion.titre,
      startDate,
      endDate,
      location: reunion.lieu ?? '',
      notes:    `Client : ${reunion.clientNom}\n[EasySalesCRM:${reunion.id}]`,
      url:      reunion.lienReunion
        ? (reunion.lienReunion.startsWith('http') ? reunion.lienReunion : `https://${reunion.lienReunion}`)
        : undefined,
      alarms:   reunion.rappelsMinutes?.map(m => ({ relativeOffset: -m })) ?? [],
    };

    const existingEventId = await this.getStoredEventId(reunion.id);
    if (existingEventId) {
      try {
        await Calendar.updateEventAsync(existingEventId, eventData);
        return existingEventId;
      } catch {
        // Si la mise à jour échoue, on retente avec un nouvel événement.
        await Calendar.deleteEventAsync(existingEventId).catch(() => {});
        await this.removeStoredEventId(reunion.id);
      }
    }

    try {
      const eventId = await Calendar.createEventAsync(calendarId, eventData);
      if (eventId) await this.setStoredEventId(reunion.id, eventId);
      return eventId;
    } catch (e) {
      console.warn('[CalendarService] Erreur addReunionToCalendar:', e);
      return null;
    }
  }

  /**
   * Supprime une réunion du calendrier natif en utilisant l'eventId stocké.
   * @param reunionId - Identifiant de la réunion CRM
   */
  static async removeReunionFromCalendar(reunionId: number): Promise<void> {
    const eventId = await this.getStoredEventId(reunionId);
    if (!eventId) return;
    try {
      await Calendar.deleteEventAsync(eventId);
    } catch (e) {
      console.warn('[CalendarService] Erreur removeReunionFromCalendar:', e);
    } finally {
      await this.removeStoredEventId(reunionId);
    }
  }
}
