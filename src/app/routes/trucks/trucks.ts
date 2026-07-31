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
  Truck,
  TrucksService,
} from '../../core/services/trucks';

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
  private readonly trucksService = inject(TrucksService);

  showForm = false;
  selectedTruck: Truck | null = null;
  editingTruckId: number | null = null;

  displayedColumns: string[] = [
    'registrationNumber',
    'brand',
    'model',
    'manufactureYear',
    'capacity',
    'fuelType',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Truck>(
    this.trucksService.getAll()
  );

  truckForm = this.formBuilder.nonNullable.group({
    registrationNumber: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
      ],
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
    capacity: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
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

    const registrationNumber =
      formValue.registrationNumber.trim().toUpperCase();

    const registrationAlreadyExists =
      this.trucksService.registrationExists(
        registrationNumber,
        this.editingTruckId
      );

    if (registrationAlreadyExists) {
      alert(
        'Un camion avec cette immatriculation existe déjà.'
      );
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
      this.trucksService.update(
        this.editingTruckId,
        truckData
      );
    } else {
      this.trucksService.add(truckData);
    }

    this.refreshTrucks();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
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

    this.trucksService.delete(truck.id);
    this.refreshTrucks();

    if (this.selectedTruck?.id === truck.id) {
      this.selectedTruck = null;
    }

    if (this.editingTruckId === truck.id) {
      this.closeForm();
    }
  }

  private refreshTrucks(): void {
    this.dataSource.data =
      this.trucksService.getAll();
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