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

interface Truck {
  id: number;
  registrationNumber: string;
  brand: string;
  model: string;
  manufactureYear: number;
  capacity: number;
  fuelType: string;
  status: 'Disponible' | 'Affecté' | 'Maintenance' | 'Hors service';
}

@Component({
  selector: 'app-trucks',
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
  templateUrl: './trucks.html',
  styleUrl: './trucks.scss',
})
export class Trucks {
  private readonly formBuilder = inject(FormBuilder);

  showForm = false;
  selectedTruck: Truck | null = null;
  editingTruckId: number | null = null;

  displayedColumns: string[] = [
    'registrationNumber',
    'brand',
    'model',
    'capacity',
    'fuelType',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Truck>([
    {
      id: 1,
      registrationNumber: '12345-A-6',
      brand: 'Volvo',
      model: 'FH16',
      manufactureYear: 2022,
      capacity: 25,
      fuelType: 'Diesel',
      status: 'Disponible',
    },
    {
      id: 2,
      registrationNumber: '67890-B-7',
      brand: 'Mercedes-Benz',
      model: 'Actros',
      manufactureYear: 2021,
      capacity: 20,
      fuelType: 'Diesel',
      status: 'Affecté',
    },
    {
      id: 3,
      registrationNumber: '24680-C-8',
      brand: 'Scania',
      model: 'R450',
      manufactureYear: 2020,
      capacity: 22,
      fuelType: 'Diesel',
      status: 'Maintenance',
    },
  ]);

  truckForm = this.formBuilder.nonNullable.group({
    registrationNumber: [
      '',
      [Validators.required, Validators.minLength(5)],
    ],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    manufactureYear: [
      new Date().getFullYear(),
      [
        Validators.required,
        Validators.min(1980),
        Validators.max(new Date().getFullYear()),
      ],
    ],
    capacity: [1, [Validators.required, Validators.min(1)]],
    fuelType: ['Diesel', Validators.required],
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
    this.editingTruckId = null;
    this.selectedTruck = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTruckId = null;
    this.resetForm();
  }

  saveTruck(): void {
    if (this.truckForm.invalid) {
      this.truckForm.markAllAsTouched();
      return;
    }

    const formValue = this.truckForm.getRawValue();
    const registrationNumber = formValue.registrationNumber.trim();

    const registrationAlreadyExists = this.dataSource.data.some(
      truck =>
        truck.id !== this.editingTruckId &&
        truck.registrationNumber.toLowerCase() ===
          registrationNumber.toLowerCase()
    );

    if (registrationAlreadyExists) {
      alert('Un camion avec cette immatriculation existe déjà.');
      return;
    }

    const truckData: Omit<Truck, 'id'> = {
      registrationNumber,
      brand: formValue.brand.trim(),
      model: formValue.model.trim(),
      manufactureYear: formValue.manufactureYear,
      capacity: formValue.capacity,
      fuelType: formValue.fuelType,
      status: formValue.status as Truck['status'],
    };

    if (this.editingTruckId !== null) {
      this.dataSource.data = this.dataSource.data.map(truck =>
        truck.id === this.editingTruckId
          ? {
              id: truck.id,
              ...truckData,
            }
          : truck
      );
    } else {
      const newTruck: Truck = {
        id: this.getNextId(),
        ...truckData,
      };

      this.dataSource.data = [...this.dataSource.data, newTruck];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewTruck(truck: Truck): void {
    this.selectedTruck = truck;
    this.showForm = false;
    this.editingTruckId = null;
  }

  closeTruckDetails(): void {
    this.selectedTruck = null;
  }

  editTruck(truck: Truck): void {
    this.selectedTruck = null;
    this.editingTruckId = truck.id;
    this.showForm = true;

    this.truckForm.setValue({
      registrationNumber: truck.registrationNumber,
      brand: truck.brand,
      model: truck.model,
      manufactureYear: truck.manufactureYear,
      capacity: truck.capacity,
      fuelType: truck.fuelType,
      status: truck.status,
    });
  }

  deleteTruck(truck: Truck): void {
  const confirmation = confirm(
    `Voulez-vous vraiment supprimer le camion ${truck.registrationNumber} ?`
  );

  if (!confirmation) {
    return;
  }

  this.dataSource.data = this.dataSource.data.filter(
    currentTruck => currentTruck.id !== truck.id
  );

  if (this.selectedTruck?.id === truck.id) {
    this.selectedTruck = null;
  }

  if (this.editingTruckId === truck.id) {
    this.closeForm();
  }
}

  private getNextId(): number {
    const ids = this.dataSource.data.map(truck => truck.id);

    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  }

  private resetForm(): void {
    this.truckForm.reset({
      registrationNumber: '',
      brand: '',
      model: '',
      manufactureYear: new Date().getFullYear(),
      capacity: 1,
      fuelType: 'Diesel',
      status: 'Disponible',
    });
  }
}