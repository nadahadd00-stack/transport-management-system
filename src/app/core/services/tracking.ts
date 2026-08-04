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
  lastUpdate: string;
  status:
    | 'En attente'
    | 'En route'
    | 'Livrée'
    | 'Retardée';
}

const STORAGE_KEY = 'tms_tracking';

const DEFAULT_TRACKING_RECORDS: TrackingRecord[] = [
  {
    id: 1,
    shipmentReference: 'EXP-2026-001',
    truck: '12345-A-6',
    driver: 'Youssef El Amrani',
    origin: 'Casablanca',
    destination: 'Rabat',
    currentLocation: 'Rabat',
    progress: 100,
    lastUpdate: '2026-07-26T14:30',
    status: 'Livrée',
  },
  {
    id: 2,
    shipmentReference: 'EXP-2026-002',
    truck: '67890-B-7',
    driver: 'Hamza Benali',
    origin: 'Casablanca',
    destination: 'Marrakech',
    currentLocation: 'Settat',
    progress: 45,
    lastUpdate: '2026-07-28T13:15',
    status: 'En route',
  },
  {
    id: 3,
    shipmentReference: 'EXP-2026-003',
    truck: '11223-C-8',
    driver: 'Omar Alaoui',
    origin: 'Tanger',
    destination: 'Fès',
    currentLocation: 'Entrepôt Tanger',
    progress: 10,
    lastUpdate: '2026-07-28T09:00',
    status: 'En attente',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  private trackingRecords: TrackingRecord[] =
    this.loadTrackingRecords();

  getAll(): TrackingRecord[] {
    return this.trackingRecords.map(record => ({
      ...record,
    }));
  }

  add(
    trackingData: Omit<TrackingRecord, 'id'>
  ): TrackingRecord {
    const newTracking: TrackingRecord = {
      id: this.getNextId(),
      ...trackingData,
    };

    this.trackingRecords = [
      ...this.trackingRecords,
      newTracking,
    ];

    this.saveTrackingRecords();

    return {
      ...newTracking,
    };
  }

  update(
    trackingId: number,
    trackingData: Omit<TrackingRecord, 'id'>
  ): TrackingRecord | undefined {
    const trackingExists =
      this.trackingRecords.some(
        record => record.id === trackingId
      );

    if (!trackingExists) {
      return undefined;
    }

    const updatedTracking: TrackingRecord = {
      id: trackingId,
      ...trackingData,
    };

    this.trackingRecords =
      this.trackingRecords.map(record =>
        record.id === trackingId
          ? updatedTracking
          : record
      );

    this.saveTrackingRecords();

    return {
      ...updatedTracking,
    };
  }

  delete(trackingId: number): void {
    this.trackingRecords =
      this.trackingRecords.filter(
        record => record.id !== trackingId
      );

    this.saveTrackingRecords();
  }

  shipmentReferenceExists(
    shipmentReference: string,
    excludedTrackingId: number | null = null
  ): boolean {
    const normalizedReference =
      shipmentReference.trim().toLowerCase();

    return this.trackingRecords.some(
      record =>
        record.id !== excludedTrackingId &&
        record.shipmentReference
          .trim()
          .toLowerCase() === normalizedReference
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

  private loadTrackingRecords(): TrackingRecord[] {
    const savedTracking =
      localStorage.getItem(STORAGE_KEY);

    if (!savedTracking) {
      this.saveDefaultTrackingRecords();

      return DEFAULT_TRACKING_RECORDS.map(record => ({
        ...record,
      }));
    }

    try {
      const parsedTracking =
        JSON.parse(savedTracking) as TrackingRecord[];

      if (!Array.isArray(parsedTracking)) {
        throw new Error('Format invalide');
      }

      return parsedTracking;
    } catch {
      this.saveDefaultTrackingRecords();

      return DEFAULT_TRACKING_RECORDS.map(record => ({
        ...record,
      }));
    }
  }

  private saveTrackingRecords(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.trackingRecords)
    );
  }

  private saveDefaultTrackingRecords(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_TRACKING_RECORDS)
    );
  }
}