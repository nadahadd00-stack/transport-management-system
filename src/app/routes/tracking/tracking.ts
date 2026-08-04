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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  TrackingRecord,
  TrackingService,
} from '../../core/services/tracking';

@Component({
  selector: 'app-tracking',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})
export class Tracking {
  private readonly formBuilder = inject(FormBuilder);
  private readonly trackingService =
    inject(TrackingService);

  showForm = false;
  selectedTracking: TrackingRecord | null = null;
  editingTrackingId: number | null = null;

  displayedColumns: string[] = [
    'shipmentReference',
    'truck',
    'driver',
    'route',
    'currentLocation',
    'progress',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<TrackingRecord>(
    this.trackingService.getAll()
  );

  trackingForm = this.formBuilder.nonNullable.group({
    shipmentReference: ['', Validators.required],
    truck: ['', Validators.required],
    driver: ['', Validators.required],
    origin: ['', Validators.required],
    destination: ['', Validators.required],
    currentLocation: ['', Validators.required],
    progress: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ],
    ],
    lastUpdate: ['', Validators.required],
    status: ['En attente', Validators.required],
  });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingTrackingId = null;
    this.selectedTracking = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTrackingId = null;
    this.resetForm();
  }

  saveTracking(): void {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.trackingForm.getRawValue();

    const shipmentReference =
      formValue.shipmentReference
        .trim()
        .toUpperCase();

    const referenceAlreadyExists =
      this.trackingService.shipmentReferenceExists(
        shipmentReference,
        this.editingTrackingId
      );

    if (referenceAlreadyExists) {
      alert(
        'Un suivi avec cette référence d’expédition existe déjà.'
      );
      return;
    }

    const origin = formValue.origin.trim();
    const destination =
      formValue.destination.trim();

    if (
      origin.toLowerCase() ===
      destination.toLowerCase()
    ) {
      alert(
        'La ville de départ et la destination doivent être différentes.'
      );
      return;
    }

    const trackingData: Omit<
      TrackingRecord,
      'id'
    > = {
      shipmentReference,
      truck: formValue.truck.trim(),
      driver: formValue.driver.trim(),
      origin,
      destination,
      currentLocation:
        formValue.currentLocation.trim(),
      progress: formValue.progress,
      lastUpdate: formValue.lastUpdate,
      status:
        formValue.status as TrackingRecord['status'],
    };

    if (this.editingTrackingId !== null) {
      this.trackingService.update(
        this.editingTrackingId,
        trackingData
      );
    } else {
      this.trackingService.add(trackingData);
    }

    this.refreshTrackingRecords();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewTracking(
    tracking: TrackingRecord
  ): void {
    this.selectedTracking = tracking;
    this.showForm = false;
    this.editingTrackingId = null;
  }

  closeTrackingDetails(): void {
    this.selectedTracking = null;
  }

  editTracking(
    tracking: TrackingRecord
  ): void {
    this.selectedTracking = null;
    this.editingTrackingId = tracking.id;
    this.showForm = true;

    this.trackingForm.setValue({
      shipmentReference:
        tracking.shipmentReference,
      truck: tracking.truck,
      driver: tracking.driver,
      origin: tracking.origin,
      destination: tracking.destination,
      currentLocation:
        tracking.currentLocation,
      progress: tracking.progress,
      lastUpdate: tracking.lastUpdate,
      status: tracking.status,
    });
  }

  deleteTracking(
    tracking: TrackingRecord
  ): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer le suivi ${tracking.shipmentReference} ?`
    );

    if (!confirmation) {
      return;
    }

    this.trackingService.delete(tracking.id);
    this.refreshTrackingRecords();

    if (
      this.selectedTracking?.id === tracking.id
    ) {
      this.selectedTracking = null;
    }

    if (
      this.editingTrackingId === tracking.id
    ) {
      this.closeForm();
    }
  }

  private refreshTrackingRecords(): void {
    this.dataSource.data =
      this.trackingService.getAll();
  }

  private resetForm(): void {
    this.trackingForm.reset({
      shipmentReference: '',
      truck: '',
      driver: '',
      origin: '',
      destination: '',
      currentLocation: '',
      progress: 0,
      lastUpdate: '',
      status: 'En attente',
    });
  }
}