import { Injectable } from '@angular/core';


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



const STORAGE_KEY = 'tms_tracking';



const DEFAULT_TRACKING: TrackingRecord[] = [

  {
    id: 1,
    shipmentReference: 'EXP-2026-001',
    truck: '12345-A-6',
    driver: 'Youssef El Amrani',
    origin: 'Casablanca',
    destination: 'Rabat',
    currentLocation: 'Rabat',
    progress: 100,
    status: 'Livrée',
    lastUpdate: '2026-07-26'
  },


  {
    id: 2,
    shipmentReference: 'EXP-2026-002',
    truck: '67890-B-7',
    driver: 'Hamza Benali',
    origin: 'Casablanca',
    destination: 'Marrakech',
    currentLocation: 'Benguerir',
    progress: 60,
    status: 'En route',
    lastUpdate: '2026-07-28'
  },


  {
    id: 3,
    shipmentReference: 'EXP-2026-003',
    truck: '11223-C-8',
    driver: 'Omar Alaoui',
    origin: 'Tanger',
    destination: 'Fès',
    currentLocation: 'Casablanca',
    progress: 30,
    status: 'Retardée',
    lastUpdate: '2026-07-30'
  }

];



@Injectable({
  providedIn: 'root'
})
export class TrackingService {


  private trackingRecords: TrackingRecord[] =
    this.loadTracking();



  getAll(): TrackingRecord[] {

    return this.trackingRecords.map(
      record => ({
        ...record
      })
    );

  }



  add(
    data: Omit<TrackingRecord,'id'>
  ): TrackingRecord {


    const record: TrackingRecord = {

      id: this.getNextId(),

      ...data

    };


    this.trackingRecords.push(record);

    this.saveTracking();


    return {
      ...record
    };

  }




  update(
    id:number,
    data: Omit<TrackingRecord,'id'>
  ): TrackingRecord | undefined {


    const updated: TrackingRecord = {

      id,

      ...data

    };


    this.trackingRecords =
      this.trackingRecords.map(record =>

        record.id === id
          ? updated
          : record

      );


    this.saveTracking();


    return {
      ...updated
    };

  }




  delete(id:number): void {


    this.trackingRecords =
      this.trackingRecords.filter(
        record => record.id !== id
      );


    this.saveTracking();

  }




  shipmentReferenceExists(
    reference:string,
    excludedId:number|null = null
  ): boolean {


    return this.trackingRecords.some(record =>

      record.id !== excludedId &&

      record.shipmentReference
        .toLowerCase()
        ===
      reference.toLowerCase()

    );

  }




  private getNextId():number {

    return this.trackingRecords.length > 0

      ? Math.max(
          ...this.trackingRecords.map(
            r => r.id
          )
        ) + 1

      : 1;

  }




  private loadTracking():TrackingRecord[] {


    const saved =
      localStorage.getItem(STORAGE_KEY);



    if(!saved){

      this.saveDefault();

      return [
        ...DEFAULT_TRACKING
      ];

    }



    try {

      return JSON.parse(saved);

    } catch {

      this.saveDefault();

      return [
        ...DEFAULT_TRACKING
      ];

    }

  }




  private saveTracking():void {


    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        this.trackingRecords
      )

    );

  }





  private saveDefault():void {


    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        DEFAULT_TRACKING
      )

    );

  }


}