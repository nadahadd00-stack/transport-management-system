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
    message:
      'L’expédition EXP-2026-001 a été livrée avec succès à Rabat.',
    type: 'Expédition',
    priority: 'Faible',
    createdAt: '2026-07-26T14:30',
    status: 'Lue',
  },
  {
    id: 2,
    title: 'Maintenance en cours',
    message:
      'Le camion 67890-B-7 est actuellement en maintenance au garage.',
    type: 'Maintenance',
    priority: 'Moyenne',
    createdAt: '2026-07-28T10:15',
    status: 'Non lue',
  },
  {
    id: 3,
    title: 'Expédition retardée',
    message:
      'L’expédition EXP-2026-002 présente un retard sur le trajet vers Marrakech.',
    type: 'Expédition',
    priority: 'Élevée',
    createdAt: '2026-07-28T13:45',
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
    const notificationExists =
      this.notifications.some(
        notification =>
          notification.id === notificationId
      );

    if (!notificationExists) {
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
    const savedNotifications =
      localStorage.getItem(STORAGE_KEY);

    if (!savedNotifications) {
      this.saveDefaultNotifications();

      return DEFAULT_NOTIFICATIONS.map(
        notification => ({
          ...notification,
        })
      );
    }

    try {
      const parsedNotifications =
        JSON.parse(
          savedNotifications
        ) as NotificationRecord[];

      if (!Array.isArray(parsedNotifications)) {
        throw new Error('Format invalide');
      }

      return parsedNotifications;
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