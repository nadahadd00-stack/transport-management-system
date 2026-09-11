import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


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



@Injectable({
  providedIn: 'root',
})
export class NotificationsService {


  private http = inject(HttpClient);


  private apiUrl =
    'http://localhost:8081/notifications';



  getAll(): Observable<NotificationRecord[]> {

    return this.http.get<NotificationRecord[]>(
      this.apiUrl
    );

  }



  getById(
    id: number
  ): Observable<NotificationRecord> {

    return this.http.get<NotificationRecord>(
      `${this.apiUrl}/${id}`
    );

  }



  add(
    notification:
    Omit<NotificationRecord,'id'>
  ): Observable<NotificationRecord> {

    return this.http.post<NotificationRecord>(
      this.apiUrl,
      notification
    );

  }



  update(
    id: number,
    notification:
    Omit<NotificationRecord,'id'>
  ): Observable<NotificationRecord> {

    return this.http.put<NotificationRecord>(
      `${this.apiUrl}/${id}`,
      notification
    );

  }



  updateStatus(
    id:number,
    status: NotificationRecord['status']
  ): Observable<NotificationRecord> {


    return this.http.put<NotificationRecord>(
      `${this.apiUrl}/${id}`,
      {
        status
      }
    );

  }



  markAllAsRead(): Observable<void> {

    return new Observable(observer => {

      observer.next();

      observer.complete();

    });

  }



  delete(
    id:number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}