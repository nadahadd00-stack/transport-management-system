import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  NotificationRecord,
  NotificationsService,
} from '../../core/services/notifications';

@Component({
  selector: 'app-notifications',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private readonly formBuilder = inject(FormBuilder);

  private readonly notificationsService =
    inject(NotificationsService);

  showForm = false;

  selectedNotification: NotificationRecord | null =
    null;

  editingNotificationId: number | null = null;

  displayedColumns: string[] = [
    'title',
    'type',
    'priority',
    'createdAt',
    'status',
    'actions',
  ];

  dataSource =
    new MatTableDataSource<NotificationRecord>(
      this.notificationsService.getAll()
    );

  notificationForm =
    this.formBuilder.nonNullable.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
        ],
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
        ],
      ],

      type: [
        'Système',
        Validators.required,
      ],

      priority: [
        'Moyenne',
        Validators.required,
      ],

      createdAt: [
        '',
        Validators.required,
      ],

      status: [
        'Non lue',
        Validators.required,
      ],
    });

  get unreadCount(): number {
    return this.dataSource.data.filter(
      notification =>
        notification.status === 'Non lue'
    ).length;
  }

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingNotificationId = null;
    this.selectedNotification = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingNotificationId = null;
    this.resetForm();
  }

  saveNotification(): void {
    if (this.notificationForm.invalid) {
      this.notificationForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.notificationForm.getRawValue();

    const notificationData: Omit<
      NotificationRecord,
      'id'
    > = {
      title: formValue.title.trim(),
      message: formValue.message.trim(),

      type:
        formValue.type as NotificationRecord['type'],

      priority:
        formValue.priority as NotificationRecord['priority'],

      createdAt: formValue.createdAt,

      status:
        formValue.status as NotificationRecord['status'],
    };

    if (
      this.editingNotificationId !== null
    ) {
      this.notificationsService.update(
        this.editingNotificationId,
        notificationData
      );
    } else {
      this.notificationsService.add(
        notificationData
      );
    }

    this.refreshNotifications();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewNotification(
    notification: NotificationRecord
  ): void {
    this.selectedNotification = notification;
    this.showForm = false;
    this.editingNotificationId = null;

    if (notification.status === 'Non lue') {
      this.notificationsService.updateStatus(
        notification.id,
        'Lue'
      );

      this.refreshNotifications();

      this.selectedNotification = {
        ...notification,
        status: 'Lue',
      };
    }
  }

  closeNotificationDetails(): void {
    this.selectedNotification = null;
  }

  editNotification(
    notification: NotificationRecord
  ): void {
    this.selectedNotification = null;

    this.editingNotificationId =
      notification.id;

    this.showForm = true;

    this.notificationForm.setValue({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      priority: notification.priority,
      createdAt: notification.createdAt,
      status: notification.status,
    });
  }

  toggleReadStatus(
    notification: NotificationRecord
  ): void {
    const newStatus: NotificationRecord['status'] =
      notification.status === 'Lue'
        ? 'Non lue'
        : 'Lue';

    this.notificationsService.updateStatus(
      notification.id,
      newStatus
    );

    this.refreshNotifications();

    if (
      this.selectedNotification?.id ===
      notification.id
    ) {
      this.selectedNotification = {
        ...this.selectedNotification,
        status: newStatus,
      };
    }
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead();
    this.refreshNotifications();

    if (this.selectedNotification) {
      this.selectedNotification = {
        ...this.selectedNotification,
        status: 'Lue',
      };
    }
  }

  deleteNotification(
    notification: NotificationRecord
  ): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer la notification « ${notification.title} » ?`
    );

    if (!confirmation) {
      return;
    }

    this.notificationsService.delete(
      notification.id
    );

    this.refreshNotifications();

    if (
      this.selectedNotification?.id ===
      notification.id
    ) {
      this.selectedNotification = null;
    }

    if (
      this.editingNotificationId ===
      notification.id
    ) {
      this.closeForm();
    }
  }

  private refreshNotifications(): void {
    this.dataSource.data =
      this.notificationsService.getAll();
  }

  private resetForm(): void {
    this.notificationForm.reset({
      title: '',
      message: '',
      type: 'Système',
      priority: 'Moyenne',
      createdAt: '',
      status: 'Non lue',
    });
  }
}