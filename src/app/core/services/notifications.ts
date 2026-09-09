import { Injectable } from '@angular/core';

export interface NotificationRecord {
  id: number;
  title: string;
  message: string;
  type:
    | 'Expédition'
    | 'Maintenance'
    | 'Camion'
    | 'Chauffeur'
    | 'Système';
  priority:
    | 'Faible'
    | 'Moyenne'
    | 'Élevée';
  createdAt: string;
  status:
    | 'Lue'
    | 'Non lue';
}

const STORAGE_KEY = 'tms_notifications';

const DEFAULT_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 1,
    title: 'Expédition livrée',
    message: 'L’expédition EXP-2026-001 a été livrée avec succès à Rabat.',
    type: 'Expédition',
    priority: 'Faible',
    createdAt: '2026-07-26T14:30',
    status: 'Lue',
  },
  {
    id: 2,
    title: 'Maintenance en cours',
    message: 'Le camion 67890-B-7 est actuellement en maintenance.',
    type: 'Maintenance',
    priority: 'Moyenne',
    createdAt: '2026-07-28T10:15',
    status: 'Non lue',
  },
  {
    id: 3,
    title: 'Expédition retardée',
    message: 'L’expédition EXP-2026-002 présente un retard.',
    type: 'Expédition',
    priority: 'Élevée',
    createdAt: '2026-07-28T13:45',
    status: 'Non lue',
  },
  {
    id: 4,
    title: 'Camion disponible',
    message: 'Le camion 44556-D-9 est maintenant disponible.',
    type: 'Camion',
    priority: 'Faible',
    createdAt: '2026-07-29T09:00',
    status: 'Lue',
  },
  {
    id: 5,
    title: 'Maintenance terminée',
    message: 'La maintenance du camion 11223-C-8 est terminée.',
    type: 'Maintenance',
    priority: 'Moyenne',
    createdAt: '2026-07-30T15:20',
    status: 'Lue',
  },
  {
    id: 6,
    title: 'Nouveau chauffeur ajouté',
    message: 'Le chauffeur Hamza Benali a été ajouté.',
    type: 'Chauffeur',
    priority: 'Faible',
    createdAt: '2026-08-01T11:00',
    status: 'Non lue',
  },
  {
    id: 7,
    title: 'Camion en maintenance',
    message: 'Le camion 99001-C-7 nécessite une intervention.',
    type: 'Camion',
    priority: 'Élevée',
    createdAt: '2026-08-02T08:30',
    status: 'Non lue',
  },
  {
    id: 8,
    title: 'Nouvelle livraison créée',
    message: 'La livraison LIV-105 a été créée.',
    type: 'Expédition',
    priority: 'Moyenne',
    createdAt: '2026-08-03T14:00',
    status: 'Lue',
  },
  {
    id: 9,
    title: 'Entrepôt actif',
    message: 'L’entrepôt Casablanca est opérationnel.',
    type: 'Système',
    priority: 'Faible',
    createdAt: '2026-08-04T10:30',
    status: 'Lue',
  },
  {
    id: 10,
    title: 'Alerte système',
    message: 'Vérification générale du système TMS.',
    type: 'Système',
    priority: 'Élevée',
    createdAt: '2026-08-05T16:45',
    status: 'Non lue',
  },
];

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {

  private notifications: NotificationRecord[] =
    this.loadNotifications();

  getAll(): NotificationRecord[] {
    return this.notifications.map(notification => ({
      ...notification,
    }));
  }

  add(
    notificationData: Omit<NotificationRecord, 'id'>
  ): NotificationRecord {

    const newNotification: NotificationRecord = {
      id: this.getNextId(),
      ...notificationData,
    };

    this.notifications = [
      ...this.notifications,
      newNotification,
    ];

    this.saveNotifications();

    return {
      ...newNotification,
    };
  }


  update(
    notificationId: number,
    notificationData: Omit<NotificationRecord, 'id'>
  ): NotificationRecord | undefined {

    const exists = this.notifications.some(
      notification => notification.id === notificationId
    );

    if (!exists) {
      return undefined;
    }

    const updatedNotification: NotificationRecord = {
      id: notificationId,
      ...notificationData,
    };

    this.notifications =
      this.notifications.map(notification =>
        notification.id === notificationId
          ? updatedNotification
          : notification
      );

    this.saveNotifications();

    return {
      ...updatedNotification,
    };
  }


  updateStatus(
    notificationId: number,
    status: NotificationRecord['status']
  ): void {

    this.notifications =
      this.notifications.map(notification =>
        notification.id === notificationId
          ? {
              ...notification,
              status,
            }
          : notification
      );

    this.saveNotifications();
  }


  markAllAsRead(): void {

    this.notifications =
      this.notifications.map(notification => ({
        ...notification,
        status: 'Lue',
      }));

    this.saveNotifications();
  }


  delete(notificationId: number): void {

    this.notifications =
      this.notifications.filter(
        notification =>
          notification.id !== notificationId
      );

    this.saveNotifications();
  }


  private getNextId(): number {

    const ids = this.notifications.map(
      notification => notification.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }


  private loadNotifications(): NotificationRecord[] {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      this.saveDefaultNotifications();

      return DEFAULT_NOTIFICATIONS.map(
        notification => ({
          ...notification,
        })
      );
    }


    try {

      const parsed =
        JSON.parse(saved) as NotificationRecord[];

      if (!Array.isArray(parsed)) {
        throw new Error();
      }

      return parsed;

    } catch {

      this.saveDefaultNotifications();

      return DEFAULT_NOTIFICATIONS.map(
        notification => ({
          ...notification,
        })
      );
    }
  }


  private saveNotifications(): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.notifications)
    );
  }


  private saveDefaultNotifications(): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_NOTIFICATIONS)
    );
  }
}