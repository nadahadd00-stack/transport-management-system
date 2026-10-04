import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Truck {

  id: number;

  registrationNumber: string;

  brand: string;

  model: string;

  manufactureYear: number;

  capacity: number;

  fuelType: string;

  status:
    
    | 'DISPONIBLE'
    | 'AFFECTE'
    | 'MAINTENANCE'
    | 'HORS_SERVICE';

}



@Injectable({
  providedIn: 'root',
})
export class TrucksService {


  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:8081/trucks';



  // GET ALL TRUCKS
  getAll(): Observable<Truck[]> {

    return this.http.get<Truck[]>(
      this.apiUrl
    );

  }



  // GET TRUCK BY ID
  getById(
    id:number
  ): Observable<Truck> {

    return this.http.get<Truck>(
      `${this.apiUrl}/${id}`
    );

  }



  // ADD TRUCK
  add(
    truckData: Omit<Truck,'id'>
  ): Observable<Truck> {

    return this.http.post<Truck>(
      this.apiUrl,
      truckData
    );

  }



  // UPDATE TRUCK
  update(
    id:number,
    truckData: Omit<Truck,'id'>
  ): Observable<Truck> {

    return this.http.put<Truck>(
      `${this.apiUrl}/${id}`,
      truckData
    );

  }



  // DELETE TRUCK
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



  // CHECK REGISTRATION
  registrationExists(
    registrationNumber:string,
    excludedTruckId:number|null=null
  ): boolean {

    return false;

  }


}