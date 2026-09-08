import { Injectable } from '@angular/core';

export interface Driver {
  id: number;
  fullName: string;
  cin: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  experienceYears: number;
  status:
    | 'Disponible'
    | 'En mission'
    | 'En congé'
    | 'Indisponible';
}

const STORAGE_KEY = 'tms_drivers';

const DEFAULT_DRIVERS: Driver[] = [
  {
    id: 1,
    fullName: 'Youssef El Amrani',
    cin: 'AB123456',
    phone: '0612345678',
    licenseNumber: 'PC-10001',
    licenseCategory: 'C',
    experienceYears: 8,
    status: 'Disponible',
  },
  {
    id: 2,
    fullName: 'Hamza Benali',
    cin: 'CD789012',
    phone: '0623456789',
    licenseNumber: 'PC-10002',
    licenseCategory: 'CE',
    experienceYears: 5,
    status: 'En mission',
  },
  {
    id: 3,
    fullName: 'Omar Alaoui',
    cin: 'EF345678',
    phone: '0634567890',
    licenseNumber: 'PC-10003',
    licenseCategory: 'C',
    experienceYears: 12,
    status: 'En congé',
  },
];

@Injectable({
  providedIn: 'root',
})
export class DriversService {
  private drivers: Driver[] = this.loadDrivers();

  getAll(): Driver[] {
    return this.drivers.map(driver => ({
      ...driver,
    }));
  }

  add(driverData: Omit<Driver, 'id'>): Driver {
    const newDriver: Driver = {
      id: this.getNextId(),
      ...driverData,
    };

    this.drivers = [
      ...this.drivers,
      newDriver,
    ];

    this.saveDrivers();

    return {
      ...newDriver,
    };
  }

  update(
    driverId: number,
    driverData: Omit<Driver, 'id'>
  ): Driver | undefined {
    const driverExists = this.drivers.some(
      driver => driver.id === driverId
    );

    if (!driverExists) {
      return undefined;
    }

    const updatedDriver: Driver = {
      id: driverId,
      ...driverData,
    };

    this.drivers = this.drivers.map(driver =>
      driver.id === driverId
        ? updatedDriver
        : driver
    );

    this.saveDrivers();

    return {
      ...updatedDriver,
    };
  }

  delete(driverId: number): void {
    this.drivers = this.drivers.filter(
      driver => driver.id !== driverId
    );

    this.saveDrivers();
  }

  cinExists(
    cin: string,
    excludedDriverId: number | null = null
  ): boolean {
    const normalizedCin =
      cin.trim().toLowerCase();

    return this.drivers.some(
      driver =>
        driver.id !== excludedDriverId &&
        driver.cin.trim().toLowerCase() ===
          normalizedCin
    );
  }

  licenseNumberExists(
    licenseNumber: string,
    excludedDriverId: number | null = null
  ): boolean {
    const normalizedLicenseNumber =
      licenseNumber.trim().toLowerCase();

    return this.drivers.some(
      driver =>
        driver.id !== excludedDriverId &&
        driver.licenseNumber.trim().toLowerCase() ===
          normalizedLicenseNumber
    );
  }

  private getNextId(): number {
    const ids = this.drivers.map(
      driver => driver.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadDrivers(): Driver[] {
    const savedDrivers =
      localStorage.getItem(STORAGE_KEY);

    if (!savedDrivers) {
      this.saveDefaultDrivers();

      return DEFAULT_DRIVERS.map(driver => ({
        ...driver,
      }));
    }

    try {
      const parsedDrivers =
        JSON.parse(savedDrivers) as Driver[];

      if (!Array.isArray(parsedDrivers)) {
        throw new Error('Format invalide');
      }

      return parsedDrivers;
    } catch {
      this.saveDefaultDrivers();

      return DEFAULT_DRIVERS.map(driver => ({
        ...driver,
      }));
    }
  }

  private saveDrivers(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.drivers)
    );
  }

  private saveDefaultDrivers(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_DRIVERS)
    );
  }
}