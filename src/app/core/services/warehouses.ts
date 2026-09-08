import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Warehouse {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  status:
    | 'Actif'
    | 'Complet'
    | 'Maintenance'
    | 'Inactif';
}

interface BackendWarehouse {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class WarehousesService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/entrepots';

  // =====================================================
  // GET ALL
  // =====================================================

  getAll(): Observable<Warehouse[]> {

    return this.http
      .get<BackendWarehouse[]>(this.apiUrl)
      .pipe(
        map(entrepots =>
          entrepots.map(entrepot => ({
            id: entrepot.id,
            name: entrepot.name,
            city: entrepot.city,
            address: entrepot.address,
            capacity: entrepot.capacity,
            status: this.convertStatus(
              entrepot.status
            ),
          }))
        )
      );
  }

  // =====================================================
  // GET BY ID
  // =====================================================

  getById(
    id: number
  ): Observable<Warehouse> {

    return this.http
      .get<BackendWarehouse>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(entrepot => ({
          id: entrepot.id,
          name: entrepot.name,
          city: entrepot.city,
          address: entrepot.address,
          capacity: entrepot.capacity,
          status: this.convertStatus(
            entrepot.status
          ),
        }))
      );
  }

  // =====================================================
  // ADD
  // =====================================================

  add(
    warehouseData: Omit<Warehouse, 'id'>
  ): Observable<Warehouse> {

    const body = {
      name: warehouseData.name,
      city: warehouseData.city,
      address: warehouseData.address,
      capacity: warehouseData.capacity,
      status: this.convertStatusToBackend(
        warehouseData.status
      ),
    };

    return this.http.post<BackendWarehouse>(
      this.apiUrl,
      body
    ).pipe(
      map(entrepot => ({
        id: entrepot.id,
        name: entrepot.name,
        city: entrepot.city,
        address: entrepot.address,
        capacity: entrepot.capacity,
        status: this.convertStatus(
          entrepot.status
        ),
      }))
    );
  }

  // =====================================================
  // UPDATE
  // =====================================================

  update(
    warehouseId: number,
    warehouseData: Omit<Warehouse, 'id'>
  ): Observable<Warehouse> {

    const body = {
      name: warehouseData.name,
      city: warehouseData.city,
      address: warehouseData.address,
      capacity: warehouseData.capacity,
      status: this.convertStatusToBackend(
        warehouseData.status
      ),
    };

    return this.http.put<BackendWarehouse>(
      `${this.apiUrl}/${warehouseId}`,
      body
    ).pipe(
      map(entrepot => ({
        id: entrepot.id,
        name: entrepot.name,
        city: entrepot.city,
        address: entrepot.address,
        capacity: entrepot.capacity,
        status: this.convertStatus(
          entrepot.status
        ),
      }))
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  delete(
    warehouseId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${warehouseId}`,
      {
        responseType: 'text',
      }
    );
  }

  // =====================================================
  // CHECK NAME
  // =====================================================

  nameExists(
    name: string,
    excludedWarehouseId: number | null = null
  ): boolean {

    // Vérification locale désactivée car
    // les données sont maintenant gérées par le backend.

    return false;
  }

  // =====================================================
  // STATUS BACKEND -> FRONTEND
  // =====================================================

  private convertStatus(
    status: string
  ):
    | 'Actif'
    | 'Complet'
    | 'Maintenance'
    | 'Inactif' {

    switch (
      status?.trim().toUpperCase()
    ) {

      case 'ACTIF':
        return 'Actif';

      case 'COMPLET':
        return 'Complet';

      case 'MAINTENANCE':
        return 'Maintenance';

      case 'INACTIF':
        return 'Inactif';

      default:
        return 'Inactif';
    }
  }

  // =====================================================
  // STATUS FRONTEND -> BACKEND
  // =====================================================

  private convertStatusToBackend(
    status:
      | 'Actif'
      | 'Complet'
      | 'Maintenance'
      | 'Inactif'
  ): string {

    switch (status) {

      case 'Actif':
        return 'ACTIF';

      case 'Complet':
        return 'COMPLET';

      case 'Maintenance':
        return 'MAINTENANCE';

      case 'Inactif':
        return 'INACTIF';

      default:
        return 'INACTIF';
    }
  }
}