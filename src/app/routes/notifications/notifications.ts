import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import {
  NotificationRecord,
  NotificationsService
} from '../../core/services/notifications';



@Component({
  selector: 'app-notifications',
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSelectModule,
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {


  private readonly notificationsService =
    inject(NotificationsService);


  private readonly formBuilder =
    inject(FormBuilder);



  notifications: NotificationRecord[] = [];


  dataSource =
    new MatTableDataSource<NotificationRecord>([]);



  selectedNotification:
    NotificationRecord | null = null;



  showForm = false;


  editingNotificationId: number | null = null;



  displayedColumns: string[] = [

    'title',
    'type',
    'priority',
    'createdAt',
    'status',
    'actions'

  ];



  notificationForm =
    this.formBuilder.nonNullable.group({

      title: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      message: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ],


      type: [
        'Système',
        Validators.required
      ],


      priority: [
        'Faible',
        Validators.required
      ],


      createdAt: [
        '',
        Validators.required
      ],


      status: [
        'Non lue',
        Validators.required
      ]

    });



  ngOnInit(): void {

    this.loadNotifications();

  }



  private loadNotifications(): void {


    this.notificationsService
      .getAll()
      .subscribe({

        next:(data)=>{

          this.notifications = data;

          this.dataSource.data = data;

        },


        error:(error)=>{

          console.error(
            'Erreur chargement notifications',
            error
          );

        }

      });

  }





  get unreadCount(): number {

    return this.notifications.filter(
      n => n.status === 'Non lue'
    ).length;

  }





  toggleForm(): void {

    if(this.showForm){

      this.closeForm();

    }
    else{

      this.openAddForm();

    }

  }





  openAddForm(): void {

    this.editingNotificationId = null;

    this.selectedNotification = null;

    this.notificationForm.reset({

      title:'',
      message:'',
      type:'Système',
      priority:'Faible',
      createdAt:new Date()
        .toISOString()
        .slice(0,16),
      status:'Non lue'

    });


    this.showForm = true;

  }





  closeForm(): void {

    this.showForm = false;

    this.editingNotificationId = null;

  }





  saveNotification(): void {


    if(this.notificationForm.invalid){

      this.notificationForm.markAllAsTouched();

      return;

    }


    const formValue =
  this.notificationForm.getRawValue();


const data: Omit<NotificationRecord, 'id'> = {

  title: formValue.title,

  message: formValue.message,

  type:
    formValue.type as NotificationRecord['type'],

  priority:
    formValue.priority as NotificationRecord['priority'],

  createdAt:
    formValue.createdAt,

  status:
    formValue.status as NotificationRecord['status']

};



    if(this.editingNotificationId !== null){


      this.notificationsService
        .update(
          this.editingNotificationId,
          data
        )
        .subscribe(()=>{

          this.loadNotifications();

          this.closeForm();

        });



    }
    else{


      this.notificationsService
        .add(data)
        .subscribe(()=>{


          this.loadNotifications();

          this.closeForm();


        });


    }


  }





  viewNotification(
    notification: NotificationRecord
  ): void {


    this.selectedNotification =
      notification;


  }





  closeNotificationDetails(): void {

    this.selectedNotification = null;

  }





  toggleReadStatus(
    notification: NotificationRecord
  ): void {


    const newStatus =
      notification.status === 'Lue'
        ? 'Non lue'
        : 'Lue';



    this.notificationsService
      .updateStatus(
        notification.id,
        newStatus
      )
      .subscribe(()=>{

        this.loadNotifications();

      });


  }





  markAllAsRead(): void {


    const requests =
      this.notifications
      .filter(n=>n.status==='Non lue');


    requests.forEach(n=>{

      this.notificationsService
        .updateStatus(
          n.id,
          'Lue'
        )
        .subscribe();

    });


    setTimeout(()=>{

      this.loadNotifications();

    },300);


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

      status: notification.status

    });


  }





  deleteNotification(
    notification: NotificationRecord
  ): void {


    const confirmation =
      confirm(
        `Supprimer la notification "${notification.title}" ?`
      );


    if(!confirmation){

      return;

    }


    this.notificationsService
      .delete(notification.id)
      .subscribe(()=>{

        this.loadNotifications();

      });


  }





  applyFilter(event: Event): void {


    const value =
      (event.target as HTMLInputElement)
      .value;


    this.dataSource.filter =
      value.trim().toLowerCase();


  }

}