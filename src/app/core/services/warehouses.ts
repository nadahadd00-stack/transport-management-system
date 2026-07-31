import { Injectable } from '@angular/core';

export interface Warehouse {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  managerName: string;
  phone: string;
  status: 'Actif' | 'Complet' | 'Maintenance' | 'Inactif';
}

const STORAGE_KEY = 'tms_warehouses';

const DEFAULT_WAREHOUSES: Warehouse[] = [
  {
    id: 1,
    name: 'Entrepôt Casablanca',
    city: 'Casablanca',
    address: 'Zone Industrielle Aïn Sebaâ',
    capacity: 5000,
    managerName: 'Karim Alaoui',
    phone: '0611223344',
    status: 'Actif',
  },
  {
    id: 2,
    name: 'Entrepôt Tanger',
    city: 'Tanger',
    address: 'Zone Franche de Tanger',
    capacity: 3500,
    managerName: 'Nadia Benali',
    phone: '0622334455',
    status: 'Complet',
  },
  {
    id: 3,
    name: 'Entrepôt Marrakech',
    city: 'Marrakech',
    address: 'Zone Industrielle Sidi Ghanem',
    capacity: 2800,
    managerName: 'Omar El Idrissi',
    phone: '0633445566',
    status: 'Maintenance',
  },
];

@Injectable({
  providedIn: 'root',
})
export class WarehousesService {
  private warehouses: Warehouse[] = this.loadWarehouses();

  getAll(): Warehouse[] {
    return this.warehouses.map(warehouse => ({
      ...warehouse,
    }));
  }

  add(
    warehouseData: Omit<Warehouse, 'id'>
  ): Warehouse {
    const newWarehouse: Warehouse = {
      id: this.getNextId(),
      ...warehouseData,
    };

    this.warehouses = [
      ...this.warehouses,
      newWarehouse,
    ];

    this.saveWarehouses();

    return {
      ...newWarehouse,
    };
  }

  update(
    warehouseId: number,
    warehouseData: Omit<Warehouse, 'id'>
  ): Warehouse | undefined {
    const warehouseExists = this.warehouses.some(
      warehouse => warehouse.id === warehouseId
    );

    if (!warehouseExists) {
      return undefined;
    }

    const updatedWarehouse: Warehouse = {
      id: warehouseId,
      ...warehouseData,
    };

    this.warehouses = this.warehouses.map(warehouse =>
      warehouse.id === warehouseId
        ? updatedWarehouse
        : warehouse
    );

    this.saveWarehouses();

    return {
      ...updatedWarehouse,
    };
  }

  delete(warehouseId: number): void {
    this.warehouses = this.warehouses.filter(
      warehouse => warehouse.id !== warehouseId
    );

    this.saveWarehouses();
  }

  nameExists(
    name: string,
    excludedWarehouseId: number | null = null
  ): boolean {
    const normalizedName =
      name.trim().toLowerCase();

    return this.warehouses.some(
      warehouse =>
        warehouse.id !== excludedWarehouseId &&
        warehouse.name.trim().toLowerCase() ===
          normalizedName
    );
  }

  private getNextId(): number {
    const ids = this.warehouses.map(
      warehouse => warehouse.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadWarehouses(): Warehouse[] {
    const savedWarehouses =
      localStorage.getItem(STORAGE_KEY);

    if (!savedWarehouses) {
      this.saveDefaultWarehouses();

      return DEFAULT_WAREHOUSES.map(warehouse => ({
        ...warehouse,
      }));
    }

    try {
      const parsedWarehouses =
        JSON.parse(savedWarehouses) as Warehouse[];

      if (!Array.isArray(parsedWarehouses)) {
        throw new Error('Format invalide');
      }

      return parsedWarehouses;
    } catch {
      this.saveDefaultWarehouses();

      return DEFAULT_WAREHOUSES.map(warehouse => ({
        ...warehouse,
      }));
    }
  }

  private saveWarehouses(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.warehouses)
    );
  }

  private saveDefaultWarehouses(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_WAREHOUSES)
    );
  }
}