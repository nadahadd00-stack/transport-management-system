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

interface MaintenanceRecord {
  id: number;
  truck: string;
  maintenanceType: string;
  description: string;
  scheduledDate: string;
  mileage: number;
  cost: number;
  workshop: string;
  status: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
}

@Component({
  selector: 'app-maintenance',
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
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.scss',
})
export class Maintenance {
  private readonly formBuilder = inject(FormBuilder);

  showForm = false;
  selectedMaintenance: MaintenanceRecord | null = null;
  editingMaintenanceId: number | null = null;

  displayedColumns: string[] = [
    'truck',
    'maintenanceType',
    'scheduledDate',
    'mileage',
    'cost',
    'workshop',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<MaintenanceRecord>([
    {
      id: 1,
      truck: '12345-A-6',
      maintenanceType: 'Vidange',
      description: 'Vidange moteur et remplacement du filtre à huile.',
      scheduledDate: '2026-07-30',
      mileage: 85000,
      cost: 1200,
      workshop: 'Garage Atlas',
      status: 'Planifiée',
    },
    {
      id: 2,
      truck: '67890-B-7',
      maintenanceType: 'Freinage',
      description: 'Contrôle et remplacement des plaquettes de frein.',
      scheduledDate: '2026-07-28',
      mileage: 112000,
      cost: 2500,
      workshop: 'Auto Service Casablanca',
      status: 'En cours',
    },
    {
      id: 3,
      truck: '11223-C-8',
      maintenanceType: 'Pneumatiques',
      description: 'Remplacement des pneumatiques avant.',
      scheduledDate: '2026-07-20',
      mileage: 97000,
      cost: 4800,
      workshop: 'Pneu Express Tanger',
      status: 'Terminée',
    },
  ]);

  maintenanceForm = this.formBuilder.nonNullable.group({
    truck: ['', Validators.required],
    maintenanceType: ['', Validators.required],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
      ],
    ],
    scheduledDate: ['', Validators.required],
    mileage: [
      0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],
    cost: [
      0,
      [
        Validators.required,
        Validators.min(0),
      ],
    ],
    workshop: ['', Validators.required],
    status: ['Planifiée', Validators.required],
  });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingMaintenanceId = null;
    this.selectedMaintenance = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingMaintenanceId = null;
    this.resetForm();
  }

  saveMaintenance(): void {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }

    const formValue = this.maintenanceForm.getRawValue();

    const maintenanceAlreadyExists = this.dataSource.data.some(
      maintenance =>
        maintenance.id !== this.editingMaintenanceId &&
        maintenance.truck === formValue.truck &&
        maintenance.maintenanceType.toLowerCase() ===
          formValue.maintenanceType.trim().toLowerCase() &&
        maintenance.scheduledDate === formValue.scheduledDate
    );

    if (maintenanceAlreadyExists) {
      alert(
        'Une maintenance identique est déjà enregistrée pour ce camion à cette date.'
      );
      return;
    }

    const maintenanceData: Omit<MaintenanceRecord, 'id'> = {
      truck: formValue.truck,
      maintenanceType: formValue.maintenanceType.trim(),
      description: formValue.description.trim(),
      scheduledDate: formValue.scheduledDate,
      mileage: formValue.mileage,
      cost: formValue.cost,
      workshop: formValue.workshop.trim(),
      status: formValue.status as MaintenanceRecord['status'],
    };

    if (this.editingMaintenanceId !== null) {
      this.dataSource.data = this.dataSource.data.map(maintenance =>
        maintenance.id === this.editingMaintenanceId
          ? {
              id: maintenance.id,
              ...maintenanceData,
            }
          : maintenance
      );
    } else {
      const newMaintenance: MaintenanceRecord = {
        id: this.getNextId(),
        ...maintenanceData,
      };

      this.dataSource.data = [
        ...this.dataSource.data,
        newMaintenance,
      ];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewMaintenance(maintenance: MaintenanceRecord): void {
    this.selectedMaintenance = maintenance;
    this.showForm = false;
    this.editingMaintenanceId = null;
  }

  closeMaintenanceDetails(): void {
    this.selectedMaintenance = null;
  }

  editMaintenance(maintenance: MaintenanceRecord): void {
    this.selectedMaintenance = null;
    this.editingMaintenanceId = maintenance.id;
    this.showForm = true;

    this.maintenanceForm.setValue({
      truck: maintenance.truck,
      maintenanceType: maintenance.maintenanceType,
      description: maintenance.description,
      scheduledDate: maintenance.scheduledDate,
      mileage: maintenance.mileage,
      cost: maintenance.cost,
      workshop: maintenance.workshop,
      status: maintenance.status,
    });
  }

  deleteMaintenance(maintenance: MaintenanceRecord): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer la maintenance du camion ${maintenance.truck} ?`
    );

    if (!confirmation) {
      return;
    }

    this.dataSource.data = this.dataSource.data.filter(
      currentMaintenance =>
        currentMaintenance.id !== maintenance.id
    );

    if (this.selectedMaintenance?.id === maintenance.id) {
      this.selectedMaintenance = null;
    }

    if (this.editingMaintenanceId === maintenance.id) {
      this.closeForm();
    }
  }

  private getNextId(): number {
    const ids = this.dataSource.data.map(
      maintenance => maintenance.id
    );

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private resetForm(): void {
    this.maintenanceForm.reset({
      truck: '',
      maintenanceType: '',
      description: '',
      scheduledDate: '',
      mileage: 0,
      cost: 0,
      workshop: '',
      status: 'Planifiée',
    });
  }
}