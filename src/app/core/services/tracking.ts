import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface TrackingRecord {

  id: number;

  shipmentReference: string;

  truck: string;

  driver: string;

  origin: string;

  destination: string;

  currentLocation: string;

  progress: number;

  status:
    | 'En attente'
    | 'En route'
    | 'Retardée'
    | 'Livrée';

  lastUpdate: string;

}



@Injectable({
  providedIn: 'root',
})
export class TrackingService {


  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:8081/tracking';



  // GET ALL

  getAll(): Observable<TrackingRecord[]> {

    return this.http.get<TrackingRecord[]>(
      this.apiUrl
    );

  }



  // ADD

  add(
    data: Omit<TrackingRecord,'id'>
  ): Observable<TrackingRecord> {


    return this.http.post<TrackingRecord>(
      this.apiUrl,
      data
    );

  }




  // UPDATE

  update(
    id:number,
    data: Omit<TrackingRecord,'id'>
  ): Observable<TrackingRecord> {


    return this.http.put<TrackingRecord>(
      `${this.apiUrl}/${id}`,
      data
    );

  }





  // DELETE

  delete(
    id:number
  ): Observable<string> {


    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        responseType:'text'
      }
    );

  }




  shipmentReferenceExists(
    reference:string,
    excludedId:number|null = null
  ): boolean {

    return false;

  }


}