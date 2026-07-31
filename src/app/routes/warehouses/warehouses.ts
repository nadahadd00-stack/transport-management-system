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
  Warehouse,
  WarehousesService,
} from '../../core/services/warehouses';

@Component({
  selector: 'app-warehouses',
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
  templateUrl: './warehouses.html',
  styleUrl: './warehouses.scss',
})
export class Warehouses {
  private readonly formBuilder = inject(FormBuilder);
  private readonly warehousesService =
    inject(WarehousesService);

  showForm = false;
  selectedWarehouse: Warehouse | null = null;
  editingWarehouseId: number | null = null;

  displayedColumns: string[] = [
    'name',
    'city',
    'capacity',
    'managerName',
    'phone',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Warehouse>(
    this.warehousesService.getAll()
  );

  warehouseForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required],
    capacity: [
      1,
      [
        Validators.required,
        Validators.min(1),
      ],
    ],
    managerName: ['', Validators.required],
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/),
      ],
    ],
    status: ['Actif', Validators.required],
  });

  toggleForm(): void {
    if (this.showForm) {
      this.closeForm();
      return;
    }

    this.openAddForm();
  }

  openAddForm(): void {
    this.editingWarehouseId = null;
    this.selectedWarehouse = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingWarehouseId = null;
    this.resetForm();
  }

  saveWarehouse(): void {
    if (this.warehouseForm.invalid) {
      this.warehouseForm.markAllAsTouched();
      return;
    }

    const formValue =
      this.warehouseForm.getRawValue();

    const name = formValue.name.trim();

    const warehouseAlreadyExists =
      this.warehousesService.nameExists(
        name,
        this.editingWarehouseId
      );

    if (warehouseAlreadyExists) {
      alert(
        'Un entrepôt avec ce nom existe déjà.'
      );
      return;
    }

    const warehouseData: Omit<Warehouse, 'id'> = {
      name,
      city: formValue.city.trim(),
      address: formValue.address.trim(),
      capacity: formValue.capacity,
      managerName: formValue.managerName.trim(),
      phone: formValue.phone.trim(),
      status: formValue.status as Warehouse['status'],
    };

    if (this.editingWarehouseId !== null) {
      this.warehousesService.update(
        this.editingWarehouseId,
        warehouseData
      );
    } else {
      this.warehousesService.add(warehouseData);
    }

    this.refreshWarehouses();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = warehouse;
    this.showForm = false;
    this.editingWarehouseId = null;
  }

  closeWarehouseDetails(): void {
    this.selectedWarehouse = null;
  }

  editWarehouse(warehouse: Warehouse): void {
    this.selectedWarehouse = null;
    this.editingWarehouseId = warehouse.id;
    this.showForm = true;

    this.warehouseForm.setValue({
      name: warehouse.name,
      city: warehouse.city,
      address: warehouse.address,
      capacity: warehouse.capacity,
      managerName: warehouse.managerName,
      phone: warehouse.phone,
      status: warehouse.status,
    });
  }

  deleteWarehouse(warehouse: Warehouse): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer l’entrepôt ${warehouse.name} ?`
    );

    if (!confirmation) {
      return;
    }

    this.warehousesService.delete(warehouse.id);
    this.refreshWarehouses();

    if (
      this.selectedWarehouse?.id === warehouse.id
    ) {
      this.selectedWarehouse = null;
    }

    if (
      this.editingWarehouseId === warehouse.id
    ) {
      this.closeForm();
    }
  }

  private refreshWarehouses(): void {
    this.dataSource.data =
      this.warehousesService.getAll();
  }

  private resetForm(): void {
    this.warehouseForm.reset({
      name: '',
      city: '',
      address: '',
      capacity: 1,
      managerName: '',
      phone: '',
      status: 'Actif',
    });
  }
}