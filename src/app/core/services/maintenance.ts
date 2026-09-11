import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface MaintenanceRecord {

  id: number;

  truck: string;

  maintenanceType: string;

  description: string;

  scheduledDate: string;

  mileage: number;

  cost: number;

  workshop: string;

  status:
    | 'Planifiée'
    | 'En cours'
    | 'Terminée'
    | 'Annulée';

}



@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {


  private http = inject(HttpClient);


  private apiUrl =
    'http://localhost:8081/maintenances';



  getAll(): Observable<MaintenanceRecord[]> {

    return this.http.get<MaintenanceRecord[]>(
      this.apiUrl
    );

  }



  getById(
    id:number
  ): Observable<MaintenanceRecord> {

    return this.http.get<MaintenanceRecord>(
      `${this.apiUrl}/${id}`
    );

  }




  add(
    maintenance: Omit<MaintenanceRecord,'id'>
  ): Observable<MaintenanceRecord> {

    return this.http.post<MaintenanceRecord>(
      this.apiUrl,
      maintenance
    );

  }




  update(
    id:number,
    maintenance: Omit<MaintenanceRecord,'id'>
  ): Observable<MaintenanceRecord> {


    return this.http.put<MaintenanceRecord>(
      `${this.apiUrl}/${id}`,
      maintenance
    );

  }




  delete(
    id:number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }



}