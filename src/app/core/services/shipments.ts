import { Injectable } from '@angular/core';

export interface Shipment {
  id: number;
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  departureDate: string;
  deliveryDate: string;
  truck: string;
  driver: string;
  status:
    | 'En préparation'
    | 'En transit'
    | 'Livrée'
    | 'Annulée';
}

const STORAGE_KEY = 'tms_shipments';

const DEFAULT_SHIPMENTS: Shipment[] = [
  {
    id: 1,
    reference: 'EXP-2026-001',
    customer: 'Atlas Distribution',
    origin: 'Casablanca',
    destination: 'Rabat',
    departureDate: '2026-07-25',
    deliveryDate: '2026-07-26',
    truck: '12345-A-6',
    driver: 'Youssef El Amrani',
    status: 'Livrée',
  },
  {
    id: 2,
    reference: 'EXP-2026-002',
    customer: 'Marrakech Logistics',
    origin: 'Casablanca',
    destination: 'Marrakech',
    departureDate: '2026-07-28',
    deliveryDate: '2026-07-29',
    truck: '67890-B-7',
    driver: 'Hamza Benali',
    status: 'En transit',
  },
  {
    id: 3,
    reference: 'EXP-2026-003',
    customer: 'Tanger Import',
    origin: 'Tanger',
    destination: 'Fès',
    departureDate: '2026-07-30',
    deliveryDate: '2026-07-31',
    truck: '11223-C-8',
    driver: 'Omar Alaoui',
    status: 'En préparation',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ShipmentsService {
  private shipments: Shipment[] = this.loadShipments();

  getAll(): Shipment[] {
    return this.shipments.map(shipment => ({
      ...shipment,
    }));
  }

  add(
    shipmentData: Omit<Shipment, 'id'>
  ): Shipment {
    const newShipment: Shipment = {
      id: this.getNextId(),
      ...shipmentData,
    };

    this.shipments = [
      ...this.shipments,
      newShipment,
    ];

    this.saveShipments();

    return {
      ...newShipment,
    };
  }

  update(
    shipmentId: number,
    shipmentData: Omit<Shipment, 'id'>
  ): Shipment | undefined {
    const shipmentExists = this.shipments.some(
      shipment => shipment.id === shipmentId
    );

    if (!shipmentExists) {
      return undefined;
    }

    const updatedShipment: Shipment = {
      id: shipmentId,
      ...shipmentData,
    };

    this.shipments = this.shipments.map(shipment =>
      shipment.id === shipmentId
        ? updatedShipment
        : shipment
    );

    this.saveShipments();

    return {
      ...updatedShipment,
    };
  }

  delete(shipmentId: number): void {
    this.shipments = this.shipments.filter(
      shipment => shipment.id !== shipmentId
    );

    this.saveShipments();
  }

  referenceExists(
    reference: string,
    excludedShipmentId: number | null = null
  ): boolean {
    const normalizedReference =
      reference.trim().toLowerCase();

    return this.shipments.some(
      shipment =>
        shipment.id !== excludedShipmentId &&
        shipment.reference.trim().toLowerCase() ===
          normalizedReference
    );
  }

  private getNextId(): number {
    const ids = this.shipments.map(
      shipment => shipment.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadShipments(): Shipment[] {
    const savedShipments =
      localStorage.getItem(STORAGE_KEY);

    if (!savedShipments) {
      this.saveDefaultShipments();

      return DEFAULT_SHIPMENTS.map(shipment => ({
        ...shipment,
      }));
    }

    try {
      const parsedShipments =
        JSON.parse(savedShipments) as Shipment[];

      if (!Array.isArray(parsedShipments)) {
        throw new Error('Format invalide');
      }

      return parsedShipments;
    } catch {
      this.saveDefaultShipments();

      return DEFAULT_SHIPMENTS.map(shipment => ({
        ...shipment,
      }));
    }
  }

  private saveShipments(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.shipments)
    );
  }

  private saveDefaultShipments(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_SHIPMENTS)
    );
  }
}