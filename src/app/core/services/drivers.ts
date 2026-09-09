import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

interface BackendChauffeur {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  hireDate: string;
  truckId: number | null;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class DriversService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8081/chauffeurs';


  getAll(): Observable<Driver[]> {

    return this.http
      .get<BackendChauffeur[]>(this.apiUrl)
      .pipe(
        map(chauffeurs =>
          chauffeurs.map(c => ({
            id: c.id,

            fullName:
              `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim(),

            cin: '',

            phone:
              c.phone ?? '',

            licenseNumber:
              c.licenseNumber ?? '',

            licenseCategory:
              'C',

            experienceYears:
              0,

            status:
              this.convertStatus(c.status),
          }))
        )
      );
  }


  add(
    driver: Omit<Driver, 'id'>
  ): Observable<any> {

    const names =
      driver.fullName
        .trim()
        .split(/\s+/);

    const firstName =
      names.shift() ?? '';

    const lastName =
      names.join(' ');

    const body = {
      firstName,
      lastName,

      phone:
        driver.phone,

      email:
        '',

      licenseNumber:
        driver.licenseNumber,

      hireDate:
        new Date()
          .toISOString()
          .substring(0, 10),

      truckId:
        null,

      status:
        this.convertStatusToBackend(
          driver.status
        ),
    };

    return this.http.post(
      this.apiUrl,
      body
    );
  }


  update(
    id: number,
    driver: Omit<Driver, 'id'>
  ): Observable<any> {

    const names =
      driver.fullName
        .trim()
        .split(/\s+/);

    const firstName =
      names.shift() ?? '';

    const lastName =
      names.join(' ');

    const body = {
      firstName,
      lastName,

      phone:
        driver.phone,

      email:
        '',

      licenseNumber:
        driver.licenseNumber,

      hireDate:
        new Date()
          .toISOString()
          .substring(0, 10),

      truckId:
        null,

      status:
        this.convertStatusToBackend(
          driver.status
        ),
    };

    return this.http.put(
      `${this.apiUrl}/${id}`,
      body
    );
  }


  delete(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }


  cinExists(
    cin: string,
    excludedDriverId: number | null = null
  ): boolean {

    return false;
  }


  licenseNumberExists(
    licenseNumber: string,
    excludedDriverId: number | null = null
  ): boolean {

    return false;
  }


  private convertStatus(
    status: string | null | undefined
  ): Driver['status'] {

    if (!status) {
      return 'Indisponible';
    }

    const normalized =
      status
        .trim()
        .toUpperCase()
        .replace(/É/g, 'E')
        .replace(/È/g, 'E')
        .replace(/Ê/g, 'E')
        .replace(/À/g, 'A')
        .replace(/Â/g, 'A')
        .replace(/Î/g, 'I')
        .replace(/Ô/g, 'O')
        .replace(/Û/g, 'U')
        .replace(/Ë/g, 'E')
        .replace(/\s+/g, '_');

    switch (normalized) {

      case 'DISPONIBLE':
      case 'AVAILABLE':
      case 'LIBRE':
      case 'ACTIF':
        return 'Disponible';

      case 'EN_MISSION':
      case 'MISSION':
      case 'EN_SERVICE':
      case 'ON_MISSION':
      case 'BUSY':
        return 'En mission';

      case 'EN_CONGE':
      case 'CONGE':
      case 'CONGES':
      case 'ON_LEAVE':
      case 'LEAVE':
        return 'En congé';

      case 'INDISPONIBLE':
      case 'UNAVAILABLE':
      case 'INACTIF':
      case 'INACTIVE':
      case 'HORS_SERVICE':
      case 'OUT_OF_SERVICE':
        return 'Indisponible';

      default:
        return 'Indisponible';
    }
  }


  private convertStatusToBackend(
    status: Driver['status']
  ): string {

    switch (status) {

      case 'Disponible':
        return 'DISPONIBLE';

      case 'En mission':
        return 'EN_MISSION';

      case 'En congé':
        return 'EN_CONGE';

      case 'Indisponible':
        return 'INDISPONIBLE';

      default:
        return 'INDISPONIBLE';
    }
  }
}