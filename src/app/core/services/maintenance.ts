import { Injectable } from '@angular/core';

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

const STORAGE_KEY = 'tms_maintenance';

const DEFAULT_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: 1,
    truck: '12345-A-6',
    maintenanceType: 'Vidange',
    description:
      'Vidange moteur et remplacement du filtre à huile.',
    scheduledDate: '2026-07-30',
    mileage: 85000,
    cost: 1200,
    workshop: 'Garage Atlas',
    status: 'Planifiée',
  },
  {
    id: 2,
    truck: '67890-B-7',
    maintenanceType: 'Freinage',
    description:
      'Contrôle et remplacement des plaquettes de frein.',
    scheduledDate: '2026-07-28',
    mileage: 112000,
    cost: 2500,
    workshop: 'Auto Service Casablanca',
    status: 'En cours',
  },
  {
    id: 3,
    truck: '11223-C-8',
    maintenanceType: 'Pneumatiques',
    description:
      'Remplacement des pneumatiques avant.',
    scheduledDate: '2026-07-20',
    mileage: 97000,
    cost: 4800,
    workshop: 'Pneu Express Tanger',
    status: 'Terminée',
  },
];

@Injectable({
  providedIn: 'root',
})
export class MaintenanceService {
  private maintenanceRecords: MaintenanceRecord[] =
    this.loadMaintenanceRecords();

  getAll(): MaintenanceRecord[] {
    return this.maintenanceRecords.map(record => ({
      ...record,
    }));
  }

  add(
    maintenanceData: Omit<MaintenanceRecord, 'id'>
  ): MaintenanceRecord {
    const newMaintenance: MaintenanceRecord = {
      id: this.getNextId(),
      ...maintenanceData,
    };

    this.maintenanceRecords = [
      ...this.maintenanceRecords,
      newMaintenance,
    ];

    this.saveMaintenanceRecords();

    return {
      ...newMaintenance,
    };
  }

  update(
    maintenanceId: number,
    maintenanceData: Omit<MaintenanceRecord, 'id'>
  ): MaintenanceRecord | undefined {
    const maintenanceExists =
      this.maintenanceRecords.some(
        record => record.id === maintenanceId
      );

    if (!maintenanceExists) {
      return undefined;
    }

    const updatedMaintenance: MaintenanceRecord = {
      id: maintenanceId,
      ...maintenanceData,
    };

    this.maintenanceRecords =
      this.maintenanceRecords.map(record =>
        record.id === maintenanceId
          ? updatedMaintenance
          : record
      );

    this.saveMaintenanceRecords();

    return {
      ...updatedMaintenance,
    };
  }

  delete(maintenanceId: number): void {
    this.maintenanceRecords =
      this.maintenanceRecords.filter(
        record => record.id !== maintenanceId
      );

    this.saveMaintenanceRecords();
  }

  maintenanceExists(
    truck: string,
    maintenanceType: string,
    scheduledDate: string,
    excludedMaintenanceId: number | null = null
  ): boolean {
    const normalizedTruck =
      truck.trim().toLowerCase();

    const normalizedType =
      maintenanceType.trim().toLowerCase();

    return this.maintenanceRecords.some(
      record =>
        record.id !== excludedMaintenanceId &&
        record.truck.trim().toLowerCase() ===
          normalizedTruck &&
        record.maintenanceType.trim().toLowerCase() ===
          normalizedType &&
        record.scheduledDate === scheduledDate
    );
  }

  private getNextId(): number {
    const ids = this.maintenanceRecords.map(
      record => record.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadMaintenanceRecords():
    MaintenanceRecord[] {
    const savedMaintenance =
      localStorage.getItem(STORAGE_KEY);

    if (!savedMaintenance) {
      this.saveDefaultMaintenanceRecords();

      return DEFAULT_MAINTENANCE_RECORDS.map(
        record => ({
          ...record,
        })
      );
    }

    try {
      const parsedMaintenance =
        JSON.parse(
          savedMaintenance
        ) as MaintenanceRecord[];

      if (!Array.isArray(parsedMaintenance)) {
        throw new Error('Format invalide');
      }

      return parsedMaintenance;
    } catch {
      this.saveDefaultMaintenanceRecords();

      return DEFAULT_MAINTENANCE_RECORDS.map(
        record => ({
          ...record,
        })
      );
    }
  }

  private saveMaintenanceRecords(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.maintenanceRecords)
    );
  }

  private saveDefaultMaintenanceRecords(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        DEFAULT_MAINTENANCE_RECORDS
      )
    );
  }
}