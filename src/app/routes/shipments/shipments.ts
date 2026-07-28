import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Shipment {
  id: number;
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  departureDate: string;
  deliveryDate: string;
  truck: string;
  driver: string;
  status: 'En préparation' | 'En transit' | 'Livrée' | 'Annulée';
}

@Component({
  selector: 'app-shipments',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './shipments.html',
  styleUrl: './shipments.scss',
})
export class Shipments {
  private readonly formBuilder = inject(FormBuilder);

  showForm = false;
  selectedShipment: Shipment | null = null;
  editingShipmentId: number | null = null;

  displayedColumns: string[] = [
    'reference',
    'customer',
    'route',
    'departureDate',
    'truck',
    'driver',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Shipment>([
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
  ]);

  shipmentForm = this.formBuilder.nonNullable.group({
    reference: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
      ],
    ],
    customer: ['', Validators.required],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    departureDate: ['', Validators.required],
    deliveryDate: ['', Validators.required],
    truck: ['', Validators.required],
    driver: ['', Validators.required],
    status: ['En préparation', Validators.required],
  });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingShipmentId = null;
    this.selectedShipment = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingShipmentId = null;
    this.resetForm();
  }

  saveShipment(): void {
    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched();
      return;
    }

    const formValue = this.shipmentForm.getRawValue();
    const reference = formValue.reference.trim().toUpperCase();
    const origin = formValue.origin.trim();
    const destination = formValue.destination.trim();

    const referenceAlreadyExists = this.dataSource.data.some(
      shipment =>
        shipment.id !== this.editingShipmentId &&
        shipment.reference.toLowerCase() === reference.toLowerCase()
    );

    if (referenceAlreadyExists) {
      alert('Une expédition avec cette référence existe déjà.');
      return;
    }

    if (origin.toLowerCase() === destination.toLowerCase()) {
      alert(
        'La ville de départ et la ville de destination doivent être différentes.'
      );
      return;
    }

    if (formValue.deliveryDate < formValue.departureDate) {
      alert(
        'La date de livraison ne peut pas être antérieure à la date de départ.'
      );
      return;
    }

    const shipmentData: Omit<Shipment, 'id'> = {
      reference,
      customer: formValue.customer.trim(),
      origin,
      destination,
      departureDate: formValue.departureDate,
      deliveryDate: formValue.deliveryDate,
      truck: formValue.truck.trim(),
      driver: formValue.driver.trim(),
      status: formValue.status as Shipment['status'],
    };

    if (this.editingShipmentId !== null) {
      this.dataSource.data = this.dataSource.data.map(shipment =>
        shipment.id === this.editingShipmentId
          ? {
              id: shipment.id,
              ...shipmentData,
            }
          : shipment
      );
    } else {
      const newShipment: Shipment = {
        id: this.getNextId(),
        ...shipmentData,
      };

      this.dataSource.data = [
        ...this.dataSource.data,
        newShipment,
      ];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewShipment(shipment: Shipment): void {
    this.selectedShipment = shipment;
    this.showForm = false;
    this.editingShipmentId = null;
  }

  closeShipmentDetails(): void {
    this.selectedShipment = null;
  }

  editShipment(shipment: Shipment): void {
    this.selectedShipment = null;
    this.editingShipmentId = shipment.id;
    this.showForm = true;

    this.shipmentForm.setValue({
      reference: shipment.reference,
      customer: shipment.customer,
      origin: shipment.origin,
      destination: shipment.destination,
      departureDate: shipment.departureDate,
      deliveryDate: shipment.deliveryDate,
      truck: shipment.truck,
      driver: shipment.driver,
      status: shipment.status,
    });
  }

  deleteShipment(shipment: Shipment): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer l’expédition ${shipment.reference} ?`
    );

    if (!confirmation) {
      return;
    }

    this.dataSource.data = this.dataSource.data.filter(
      currentShipment => currentShipment.id !== shipment.id
    );

    if (this.selectedShipment?.id === shipment.id) {
      this.selectedShipment = null;
    }

    if (this.editingShipmentId === shipment.id) {
      this.closeForm();
    }
  }

  private getNextId(): number {
    const ids = this.dataSource.data.map(shipment => shipment.id);

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private resetForm(): void {
    this.shipmentForm.reset({
      reference: '',
      customer: '',
      origin: '',
      destination: '',
      departureDate: '',
      deliveryDate: '',
      truck: '',
      driver: '',
      status: 'En préparation',
    });
  }
}