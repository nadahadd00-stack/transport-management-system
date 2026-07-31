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
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Shipment,
  ShipmentsService,
} from '../../core/services/shipments';

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
  private readonly shipmentsService =
    inject(ShipmentsService);

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

  dataSource = new MatTableDataSource<Shipment>(
    this.shipmentsService.getAll()
  );

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

    const formValue =
      this.shipmentForm.getRawValue();

    const reference = formValue.reference
      .trim()
      .toUpperCase();

    const origin = formValue.origin.trim();
    const destination =
      formValue.destination.trim();

    const referenceAlreadyExists =
      this.shipmentsService.referenceExists(
        reference,
        this.editingShipmentId
      );

    if (referenceAlreadyExists) {
      alert(
        'Une expédition avec cette référence existe déjà.'
      );
      return;
    }

    if (
      origin.toLowerCase() ===
      destination.toLowerCase()
    ) {
      alert(
        'La ville de départ et la ville de destination doivent être différentes.'
      );
      return;
    }

    if (
      formValue.deliveryDate <
      formValue.departureDate
    ) {
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
      this.shipmentsService.update(
        this.editingShipmentId,
        shipmentData
      );
    } else {
      this.shipmentsService.add(shipmentData);
    }

    this.refreshShipments();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
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

    this.shipmentsService.delete(shipment.id);
    this.refreshShipments();

    if (
      this.selectedShipment?.id === shipment.id
    ) {
      this.selectedShipment = null;
    }

    if (
      this.editingShipmentId === shipment.id
    ) {
      this.closeForm();
    }
  }

  private refreshShipments(): void {
    this.dataSource.data =
      this.shipmentsService.getAll();
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