import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Shipment {

  id: number;

  reference: string;

  customerId: number;

  truckId: number;

  driverId: number;

  warehouseId: number;

  destinationAddress: string;

  destinationCity: string;

  cargoWeight: number;

  departureDate: string;

  expectedArrival: string;

  status:
  | 'En préparation'
  | 'En transit'
  | 'Livrée'
  | 'Annulée';

}



@Injectable({
  providedIn:'root'
})
export class ShipmentsService {


private http = inject(HttpClient);


private apiUrl =
'http://localhost:8081/livraisons';



getAll(): Observable<Shipment[]> {

 return this.http.get<Shipment[]>(
   this.apiUrl
 );

}



getById(id:number):Observable<Shipment>{

 return this.http.get<Shipment>(
  `${this.apiUrl}/${id}`
 );

}



add(
 shipment:Omit<Shipment,'id'>
):Observable<Shipment>{

 return this.http.post<Shipment>(
   this.apiUrl,
   shipment
 );

}



update(
 id:number,
 shipment:Omit<Shipment,'id'>
):Observable<Shipment>{

 return this.http.put<Shipment>(
  `${this.apiUrl}/${id}`,
  shipment
 );

}



delete(id:number):Observable<string>{

 return this.http.delete(
   `${this.apiUrl}/${id}`,
   {
    responseType:'text'
   }
 );

}


}