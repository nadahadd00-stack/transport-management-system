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
  Driver,
  DriversService,
} from '../../core/services/drivers';

@Component({
  selector: 'app-drivers',
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
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class Drivers {
  private readonly formBuilder = inject(FormBuilder);
  private readonly driversService = inject(DriversService);

  showForm = false;
  selectedDriver: Driver | null = null;
  editingDriverId: number | null = null;

  displayedColumns: string[] = [
    'fullName',
    'cin',
    'phone',
    'licenseNumber',
    'licenseCategory',
    'experienceYears',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Driver>(
    this.driversService.getAll()
  );

  driverForm = this.formBuilder.nonNullable.group({
    fullName: ['', Validators.required],
    cin: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
      ],
    ],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ],
    ],
    licenseNumber: ['', Validators.required],
    licenseCategory: ['C', Validators.required],
    experienceYears: [
      0,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(50),
      ],
    ],
    status: ['Disponible', Validators.required],
  });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingDriverId = null;
    this.selectedDriver = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingDriverId = null;
    this.resetForm();
  }

  saveDriver(): void {
    if (this.driverForm.invalid) {
      this.driverForm.markAllAsTouched();
      return;
    }

    const formValue = this.driverForm.getRawValue();

    const cin = formValue.cin
      .trim()
      .toUpperCase();

    const licenseNumber = formValue.licenseNumber
      .trim()
      .toUpperCase();

    const cinAlreadyExists =
      this.driversService.cinExists(
        cin,
        this.editingDriverId
      );

    if (cinAlreadyExists) {
      alert(
        'Un chauffeur avec ce numéro de CIN existe déjà.'
      );
      return;
    }

    const licenseAlreadyExists =
      this.driversService.licenseNumberExists(
        licenseNumber,
        this.editingDriverId
      );

    if (licenseAlreadyExists) {
      alert(
        'Un chauffeur avec ce numéro de permis existe déjà.'
      );
      return;
    }

    const driverData: Omit<Driver, 'id'> = {
      fullName: formValue.fullName.trim(),
      cin,
      phone: formValue.phone.trim(),
      licenseNumber,
      licenseCategory: formValue.licenseCategory,
      experienceYears: formValue.experienceYears,
      status: formValue.status as Driver['status'],
    };

    if (this.editingDriverId !== null) {
      this.driversService.update(
        this.editingDriverId,
        driverData
      );
    } else {
      this.driversService.add(driverData);
    }

    this.refreshDrivers();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewDriver(driver: Driver): void {
    this.selectedDriver = driver;
    this.showForm = false;
    this.editingDriverId = null;
  }

  closeDriverDetails(): void {
    this.selectedDriver = null;
  }

  editDriver(driver: Driver): void {
    this.selectedDriver = null;
    this.editingDriverId = driver.id;
    this.showForm = true;

    this.driverForm.setValue({
      fullName: driver.fullName,
      cin: driver.cin,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      licenseCategory: driver.licenseCategory,
      experienceYears: driver.experienceYears,
      status: driver.status,
    });
  }

  deleteDriver(driver: Driver): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer le chauffeur ${driver.fullName} ?`
    );

    if (!confirmation) {
      return;
    }

    this.driversService.delete(driver.id);
    this.refreshDrivers();

    if (this.selectedDriver?.id === driver.id) {
      this.selectedDriver = null;
    }

    if (this.editingDriverId === driver.id) {
      this.closeForm();
    }
  }

  private refreshDrivers(): void {
    this.dataSource.data =
      this.driversService.getAll();
  }

  private resetForm(): void {
    this.driverForm.reset({
      fullName: '',
      cin: '',
      phone: '',
      licenseNumber: '',
      licenseCategory: 'C',
      experienceYears: 0,
      status: 'Disponible',
    });
  }
}