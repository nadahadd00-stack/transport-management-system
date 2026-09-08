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
  MaintenanceRecord,
  MaintenanceService,
} from '../../core/services/maintenance';

import {
  Truck,
  TrucksService,
} from '../../core/services/trucks';

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
  private readonly formBuilder =
    inject(FormBuilder);

  private readonly maintenanceService =
    inject(MaintenanceService);

  private readonly trucksService =
    inject(TrucksService);

  trucks: Truck[] = [];

  showForm = false;

  selectedMaintenance: MaintenanceRecord | null =
    null;

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

  dataSource =
    new MatTableDataSource<MaintenanceRecord>(
      this.maintenanceService.getAll()
    );

  maintenanceForm =
    this.formBuilder.nonNullable.group({
      truck: ['', Validators.required],

      maintenanceType: [
        '',
        Validators.required,
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
        ],
      ],

      scheduledDate: [
        '',
        Validators.required,
      ],

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

      workshop: [
        '',
        Validators.required,
      ],

      status: [
        'Planifiée',
        Validators.required,
      ],
    });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.refreshTrucks();

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

    const formValue =
      this.maintenanceForm.getRawValue();

    const truck = formValue.truck.trim();

    const maintenanceType =
      formValue.maintenanceType.trim();

    const maintenanceAlreadyExists =
      this.maintenanceService.maintenanceExists(
        truck,
        maintenanceType,
        formValue.scheduledDate,
        this.editingMaintenanceId
      );

    if (maintenanceAlreadyExists) {
      alert(
        'Une maintenance identique est déjà enregistrée pour ce camion à cette date.'
      );
      return;
    }

    const maintenanceData: Omit<
      MaintenanceRecord,
      'id'
    > = {
      truck,
      maintenanceType,
      description:
        formValue.description.trim(),
      scheduledDate:
        formValue.scheduledDate,
      mileage: formValue.mileage,
      cost: formValue.cost,
      workshop:
        formValue.workshop.trim(),
      status:
        formValue.status as MaintenanceRecord['status'],
    };

    if (
      this.editingMaintenanceId !== null
    ) {
      this.maintenanceService.update(
        this.editingMaintenanceId,
        maintenanceData
      );
    } else {
      this.maintenanceService.add(
        maintenanceData
      );
    }

    this.refreshMaintenanceRecords();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement)
        .value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewMaintenance(
    maintenance: MaintenanceRecord
  ): void {
    this.selectedMaintenance =
      maintenance;

    this.showForm = false;
    this.editingMaintenanceId = null;
  }

  closeMaintenanceDetails(): void {
    this.selectedMaintenance = null;
  }

  editMaintenance(
    maintenance: MaintenanceRecord
  ): void {
    this.refreshTrucks();

    this.selectedMaintenance = null;

    this.editingMaintenanceId =
      maintenance.id;

    this.showForm = true;

    this.maintenanceForm.setValue({
      truck: maintenance.truck,
      maintenanceType:
        maintenance.maintenanceType,
      description:
        maintenance.description,
      scheduledDate:
        maintenance.scheduledDate,
      mileage: maintenance.mileage,
      cost: maintenance.cost,
      workshop: maintenance.workshop,
      status: maintenance.status,
    });
  }

  deleteMaintenance(
    maintenance: MaintenanceRecord
  ): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer la maintenance du camion ${maintenance.truck} ?`
    );

    if (!confirmation) {
      return;
    }

    this.maintenanceService.delete(
      maintenance.id
    );

    this.refreshMaintenanceRecords();

    if (
      this.selectedMaintenance?.id ===
      maintenance.id
    ) {
      this.selectedMaintenance = null;
    }

    if (
      this.editingMaintenanceId ===
      maintenance.id
    ) {
      this.closeForm();
    }
  }

  private refreshMaintenanceRecords(): void {
    this.dataSource.data =
      this.maintenanceService.getAll();
  }

  private refreshTrucks(): void {

  this.trucksService
    .getAll()
    .subscribe({

      next:(data:Truck[])=>{

        this.trucks = data;

      }

    });

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