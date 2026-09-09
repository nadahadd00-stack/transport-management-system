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
    lastUpdate: '2026-07-26',
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
    lastUpdate: '2026-07-28',
  },
  {
    id: 3,
    shipmentReference: 'EXP-2026-003',
    truck: '11223-C-8',
    driver: 'Omar Alaoui',
    origin: 'Tanger',
    destination: 'Fès',
    currentLocation: 'Kénitra',
    progress: 35,
    status: 'Retardée',
    lastUpdate: '2026-07-30',
  },
  {
    id: 4,
    shipmentReference: 'EXP-2026-004',
    truck: '44556-D-9',
    driver: 'Nabil Idrissi',
    origin: 'Agadir',
    destination: 'Casablanca',
    currentLocation: 'Marrakech',
    progress: 50,
    status: 'En route',
    lastUpdate: '2026-08-01',
  },
  {
    id: 5,
    shipmentReference: 'EXP-2026-005',
    truck: '77889-A-5',
    driver: 'Karim Bennani',
    origin: 'Rabat',
    destination: 'Tanger',
    currentLocation: 'Larache',
    progress: 75,
    status: 'En route',
    lastUpdate: '2026-08-03',
  },
  {
    id: 6,
    shipmentReference: 'EXP-2026-006',
    truck: '88990-B-6',
    driver: 'Rachid El Fassi',
    origin: 'Marrakech',
    destination: 'Agadir',
    currentLocation: 'Marrakech',
    progress: 10,
    status: 'En attente',
    lastUpdate: '2026-08-04',
  },
  {
    id: 7,
    shipmentReference: 'EXP-2026-007',
    truck: '99001-C-7',
    driver: 'Mehdi Ouahbi',
    origin: 'Casablanca',
    destination: 'El Jadida',
    currentLocation: 'El Jadida',
    progress: 100,
    status: 'Livrée',
    lastUpdate: '2026-08-05',
  },
  {
    id: 8,
    shipmentReference: 'EXP-2026-008',
    truck: '11002-D-8',
    driver: 'Adil Berrada',
    origin: 'Fès',
    destination: 'Meknès',
    currentLocation: 'Fès',
    progress: 20,
    status: 'En route',
    lastUpdate: '2026-08-06',
  },
  {
    id: 9,
    shipmentReference: 'EXP-2026-009',
    truck: '22003-E-9',
    driver: 'Hicham Zerouali',
    origin: 'Oujda',
    destination: 'Fès',
    currentLocation: 'Taza',
    progress: 55,
    status: 'Retardée',
    lastUpdate: '2026-08-07',
  },
  {
    id: 10,
    shipmentReference: 'EXP-2026-010',
    truck: '33004-F-10',
    driver: 'Yassine Chakir',
    origin: 'Safi',
    destination: 'Casablanca',
    currentLocation: 'Settat',
    progress: 70,
    status: 'En route',
    lastUpdate: '2026-08-08',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TrackingService {

  private trackingRecords: TrackingRecord[] =
    this.loadTracking();

  getAll(): TrackingRecord[] {
    return this.trackingRecords.map(record => ({
      ...record,
    }));
  }

  add(
    data: Omit<TrackingRecord, 'id'>
  ): TrackingRecord {

    const record: TrackingRecord = {
      id: this.getNextId(),
      ...data,
    };

    this.trackingRecords.push(record);

    this.saveTracking();

    return {
      ...record,
    };
  }

  update(
    id: number,
    data: Omit<TrackingRecord, 'id'>
  ): TrackingRecord | undefined {

    const exists = this.trackingRecords.some(
      record => record.id === id
    );

    if (!exists) {
      return undefined;
    }

    const updated: TrackingRecord = {
      id,
      ...data,
    };

    this.trackingRecords =
      this.trackingRecords.map(record =>
        record.id === id
          ? updated
          : record
      );

    this.saveTracking();

    return {
      ...updated,
    };
  }

  delete(id: number): void {

    this.trackingRecords =
      this.trackingRecords.filter(
        record => record.id !== id
      );

    this.saveTracking();
  }

  shipmentReferenceExists(
    reference: string,
    excludedId: number | null = null
  ): boolean {

    const normalizedReference =
      reference.trim().toLowerCase();

    return this.trackingRecords.some(
      record =>
        record.id !== excludedId &&
        record.shipmentReference
          .trim()
          .toLowerCase() ===
          normalizedReference
    );
  }

  private getNextId(): number {

    const ids = this.trackingRecords.map(
      record => record.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadTracking(): TrackingRecord[] {

    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (!saved) {

      this.saveDefault();

      return DEFAULT_TRACKING.map(
        record => ({
          ...record,
        })
      );
    }

    try {

      const parsed =
        JSON.parse(saved) as TrackingRecord[];

      if (!Array.isArray(parsed)) {
        throw new Error('Format invalide');
      }

      return parsed;

    } catch {

      this.saveDefault();

      return DEFAULT_TRACKING.map(
        record => ({
          ...record,
        })
      );
    }
  }

  private saveTracking(): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.trackingRecords)
    );
  }

  private saveDefault(): void {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_TRACKING)
    );
  }
}