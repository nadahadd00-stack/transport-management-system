import { Injectable } from '@angular/core';

export interface Truck {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  manufactureYear: number;
  capacity: number;
  fuelType: string;
  status: 'Disponible' | 'Affecté' | 'Maintenance' | 'Hors service';
}

const STORAGE_KEY = 'tms_trucks';

const DEFAULT_TRUCKS: Truck[] = [
  {
    id: 1,
    registrationNumber: '12345-A-6',
    brand: 'Volvo',
    model: 'FH16',
    manufactureYear: 2022,
    capacity: 25,
    fuelType: 'Diesel',
    status: 'Disponible',
  },
  {
    id: 2,
    registrationNumber: '67890-B-7',
    brand: 'Mercedes',
    model: 'Actros',
    manufactureYear: 2021,
    capacity: 20,
    fuelType: 'Diesel',
    status: 'Affecté',
  },
  {
    id: 3,
    registrationNumber: '11223-C-8',
    brand: 'Scania',
    model: 'R450',
    manufactureYear: 2020,
    capacity: 22,
    fuelType: 'Diesel',
    status: 'Maintenance',
  },
];

@Injectable({
  providedIn: 'root',
})
export class TrucksService {
  private trucks: Truck[] = this.loadTrucks();

  getAll(): Truck[] {
    return this.trucks.map(truck => ({ ...truck }));
  }

  add(truckData: Omit<Truck, 'id'>): Truck {
    const newTruck: Truck = {
      id: this.getNextId(),
      ...truckData,
    };

    this.trucks = [...this.trucks, newTruck];
    this.saveTrucks();

    return { ...newTruck };
  }

  update(
    truckId: number,
    truckData: Omit<Truck, 'id'>
  ): Truck | undefined {
    const truckExists = this.trucks.some(
      truck => truck.id === truckId
    );

    if (!truckExists) {
      return undefined;
    }

    const updatedTruck: Truck = {
      id: truckId,
      ...truckData,
    };

    this.trucks = this.trucks.map(truck =>
      truck.id === truckId ? updatedTruck : truck
    );

    this.saveTrucks();

    return { ...updatedTruck };
  }

  delete(truckId: number): void {
    this.trucks = this.trucks.filter(
      truck => truck.id !== truckId
    );

    this.saveTrucks();
  }

  registrationExists(
    registrationNumber: string,
    excludedTruckId: number | null = null
  ): boolean {
    const normalizedRegistration =
      registrationNumber.trim().toLowerCase();

    return this.trucks.some(
      truck =>
        truck.id !== excludedTruckId &&
        truck.registrationNumber.trim().toLowerCase() ===
          normalizedRegistration
    );
  }

  private getNextId(): number {
    const ids = this.trucks.map(truck => truck.id);

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private loadTrucks(): Truck[] {
    const savedTrucks = localStorage.getItem(STORAGE_KEY);

    if (!savedTrucks) {
      this.saveDefaultTrucks();
      return DEFAULT_TRUCKS.map(truck => ({ ...truck }));
    }

    try {
      const parsedTrucks = JSON.parse(savedTrucks) as Truck[];

      if (!Array.isArray(parsedTrucks)) {
        throw new Error('Format invalide');
      }

      return parsedTrucks;
    } catch {
      this.saveDefaultTrucks();
      return DEFAULT_TRUCKS.map(truck => ({ ...truck }));
    }
  }

  private saveTrucks(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.trucks)
    );
  }

  private saveDefaultTrucks(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_TRUCKS)
    );
  }
}