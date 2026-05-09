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
import { ReunionResponse } from '../types/reunion.types';

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

  /**
   * Trouve ou crée le calendrier "Easy Sales CRM" dans le calendrier natif.
   * @returns L'ID du calendrier CRM
   */
  private static async getOrCreateCrmCalendar(): Promise<string | null> {
    try {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const existing  = calendars.find(c => c.title === 'Easy Sales CRM');
      if (existing) return existing.id;

      // Créer le calendrier si inexistant
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      const crmCalendarId   = await Calendar.createCalendarAsync({
        title:       'Easy Sales CRM',
        color:       '#2563EB',
        entityType:  Calendar.EntityTypes.EVENT,
        sourceId:    defaultCalendar.source.id,
        source:      defaultCalendar.source,
        name:        'easysalescrm',
        ownerAccount: 'personal',
        accessLevel: Calendar.CalendarAccessLevel.OWNER,
      });
      return crmCalendarId;
    } catch (e) {
      console.warn('[CalendarService] Impossible de créer/trouver le calendrier CRM:', e);
      return null;
    }
  }

  /**
   * Ajoute une réunion CRM dans le calendrier natif de l'appareil.
   * L'événement est marqué avec [EasySalesCRM] dans les notes pour
   * pouvoir le retrouver et le mettre à jour/supprimer plus tard.
   *
   * @param reunion - La réunion à ajouter au calendrier
   * @returns L'ID de l'événement créé dans le calendrier natif, ou null
   */
  static async addReunionToCalendar(reunion: ReunionResponse): Promise<string | null> {
    const hasPermission = await Calendar.requestCalendarPermissionsAsync()
      .then(r => r.status === 'granted');
    if (!hasPermission) return null;

    const crmCalendarId = await this.getOrCreateCrmCalendar();
    if (!crmCalendarId) return null;

    try {
      const startDate = new Date(reunion.dateHeure);
      const endDate   = new Date(startDate.getTime() + reunion.dureeMinutes * 60 * 1000);

      const eventId = await Calendar.createEventAsync(crmCalendarId, {
        title:     reunion.titre,
        startDate,
        endDate,
        location:  reunion.lieu ?? '',
        notes:     `Client : ${reunion.clientNom}\n[EasySalesCRM:${reunion.id}]`,
        url:       reunion.lienReunion
          ? (reunion.lienReunion.startsWith('http') ? reunion.lienReunion : `https://${reunion.lienReunion}`)
          : undefined,
        alarms:    reunion.rappelsMinutes?.map(m => ({
          relativeOffset: -m,
        })) ?? [],
      });
      return eventId;
    } catch (e) {
      console.warn('[CalendarService] Erreur addReunionToCalendar:', e);
      return null;
    }
  }

  /**
   * Supprime un événement du calendrier natif.
   * @param nativeEventId - L'ID de l'événement natif retourné par addReunionToCalendar
   */
  static async removeFromCalendar(nativeEventId: string): Promise<void> {
    try {
      await Calendar.deleteEventAsync(nativeEventId);
    } catch (e) {
      console.warn('[CalendarService] Erreur removeFromCalendar:', e);
    }
  }
}