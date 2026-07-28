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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

interface TrackingRecord {
  id: number;
  shipmentReference: string;
  truck: string;
  driver: string;
  origin: string;
  destination: string;
  currentLocation: string;
  progress: number;
  lastUpdate: string;
  status: 'En attente' | 'En route' | 'Livrée' | 'Retardée';
}

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

  dataSource = new MatTableDataSource<TrackingRecord>([
    {
      id: 1,
      shipmentReference: 'EXP-2026-001',
      truck: '12345-A-6',
      driver: 'Youssef El Amrani',
      origin: 'Casablanca',
      destination: 'Rabat',
      currentLocation: 'Rabat',
      progress: 100,
      lastUpdate: '2026-07-26T14:30',
      status: 'Livrée',
    },
    {
      id: 2,
      shipmentReference: 'EXP-2026-002',
      truck: '67890-B-7',
      driver: 'Hamza Benali',
      origin: 'Casablanca',
      destination: 'Marrakech',
      currentLocation: 'Settat',
      progress: 45,
      lastUpdate: '2026-07-28T13:15',
      status: 'En route',
    },
    {
      id: 3,
      shipmentReference: 'EXP-2026-003',
      truck: '11223-C-8',
      driver: 'Omar Alaoui',
      origin: 'Tanger',
      destination: 'Fès',
      currentLocation: 'Entrepôt Tanger',
      progress: 10,
      lastUpdate: '2026-07-28T09:00',
      status: 'En attente',
    },
  ]);

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

    const formValue = this.trackingForm.getRawValue();
    const shipmentReference =
      formValue.shipmentReference.trim().toUpperCase();

    const referenceAlreadyExists = this.dataSource.data.some(
      tracking =>
        tracking.id !== this.editingTrackingId &&
        tracking.shipmentReference.toLowerCase() ===
          shipmentReference.toLowerCase()
    );

    if (referenceAlreadyExists) {
      alert(
        'Un suivi avec cette référence d’expédition existe déjà.'
      );
      return;
    }

    if (
      formValue.origin.trim().toLowerCase() ===
      formValue.destination.trim().toLowerCase()
    ) {
      alert(
        'La ville de départ et la destination doivent être différentes.'
      );
      return;
    }

    const trackingData: Omit<TrackingRecord, 'id'> = {
      shipmentReference,
      truck: formValue.truck.trim(),
      driver: formValue.driver.trim(),
      origin: formValue.origin.trim(),
      destination: formValue.destination.trim(),
      currentLocation: formValue.currentLocation.trim(),
      progress: formValue.progress,
      lastUpdate: formValue.lastUpdate,
      status: formValue.status as TrackingRecord['status'],
    };

    if (this.editingTrackingId !== null) {
      this.dataSource.data = this.dataSource.data.map(tracking =>
        tracking.id === this.editingTrackingId
          ? {
              id: tracking.id,
              ...trackingData,
            }
          : tracking
      );
    } else {
      const newTracking: TrackingRecord = {
        id: this.getNextId(),
        ...trackingData,
      };

      this.dataSource.data = [
        ...this.dataSource.data,
        newTracking,
      ];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewTracking(tracking: TrackingRecord): void {
    this.selectedTracking = tracking;
    this.showForm = false;
    this.editingTrackingId = null;
  }

  closeTrackingDetails(): void {
    this.selectedTracking = null;
  }

  editTracking(tracking: TrackingRecord): void {
    this.selectedTracking = null;
    this.editingTrackingId = tracking.id;
    this.showForm = true;

    this.trackingForm.setValue({
      shipmentReference: tracking.shipmentReference,
      truck: tracking.truck,
      driver: tracking.driver,
      origin: tracking.origin,
      destination: tracking.destination,
      currentLocation: tracking.currentLocation,
      progress: tracking.progress,
      lastUpdate: tracking.lastUpdate,
      status: tracking.status,
    });
  }

  deleteTracking(tracking: TrackingRecord): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer le suivi ${tracking.shipmentReference} ?`
    );

    if (!confirmation) {
      return;
    }

    this.dataSource.data = this.dataSource.data.filter(
      currentTracking => currentTracking.id !== tracking.id
    );

    if (this.selectedTracking?.id === tracking.id) {
      this.selectedTracking = null;
    }

    if (this.editingTrackingId === tracking.id) {
      this.closeForm();
    }
  }

  private getNextId(): number {
    const ids = this.dataSource.data.map(tracking => tracking.id);

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
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