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

interface Driver {
  id: number;
  fullName: string;
  cin: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: string;
  experienceYears: number;
  status: 'Disponible' | 'En mission' | 'En congé' | 'Indisponible';
}

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

  dataSource = new MatTableDataSource<Driver>([
    {
      id: 1,
      fullName: 'Youssef El Amrani',
      cin: 'AB123456',
      phone: '0612345678',
      licenseNumber: 'PC-10001',
      licenseCategory: 'C',
      experienceYears: 8,
      status: 'Disponible',
    },
    {
      id: 2,
      fullName: 'Hamza Benali',
      cin: 'CD789012',
      phone: '0623456789',
      licenseNumber: 'PC-10002',
      licenseCategory: 'CE',
      experienceYears: 5,
      status: 'En mission',
    },
    {
      id: 3,
      fullName: 'Omar Alaoui',
      cin: 'EF345678',
      phone: '0634567890',
      licenseNumber: 'PC-10003',
      licenseCategory: 'C',
      experienceYears: 12,
      status: 'En congé',
    },
  ]);

  driverForm = this.formBuilder.nonNullable.group({
    fullName: ['', Validators.required],
    cin: ['', [Validators.required, Validators.minLength(5)]],
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
    const licenseNumber = formValue.licenseNumber.trim().toUpperCase();
    const cin = formValue.cin.trim().toUpperCase();

    const licenseAlreadyExists = this.dataSource.data.some(
      driver =>
        driver.id !== this.editingDriverId &&
        driver.licenseNumber.toLowerCase() === licenseNumber.toLowerCase()
    );

    if (licenseAlreadyExists) {
      alert('Un chauffeur avec ce numéro de permis existe déjà.');
      return;
    }

    const cinAlreadyExists = this.dataSource.data.some(
      driver =>
        driver.id !== this.editingDriverId &&
        driver.cin.toLowerCase() === cin.toLowerCase()
    );

    if (cinAlreadyExists) {
      alert('Un chauffeur avec ce numéro de CIN existe déjà.');
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
      this.dataSource.data = this.dataSource.data.map(driver =>
        driver.id === this.editingDriverId
          ? {
              id: driver.id,
              ...driverData,
            }
          : driver
      );
    } else {
      const newDriver: Driver = {
        id: this.getNextId(),
        ...driverData,
      };

      this.dataSource.data = [...this.dataSource.data, newDriver];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
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

    this.dataSource.data = this.dataSource.data.filter(
      currentDriver => currentDriver.id !== driver.id
    );

    if (this.selectedDriver?.id === driver.id) {
      this.selectedDriver = null;
    }

    if (this.editingDriverId === driver.id) {
      this.closeForm();
    }
  }

  private getNextId(): number {
    const ids = this.dataSource.data.map(driver => driver.id);

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
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