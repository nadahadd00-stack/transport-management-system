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

interface Warehouse {
  id: number;
  name: string;
  city: string;
  address: string;
  capacity: number;
  managerName: string;
  phone: string;
  status: 'Actif' | 'Complet' | 'Maintenance' | 'Inactif';
}

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

  dataSource = new MatTableDataSource<Warehouse>([
    {
      id: 1,
      name: 'Entrepôt Casablanca',
      city: 'Casablanca',
      address: 'Zone Industrielle Aïn Sebaâ',
      capacity: 5000,
      managerName: 'Karim Alaoui',
      phone: '0611223344',
      status: 'Actif',
    },
    {
      id: 2,
      name: 'Entrepôt Tanger',
      city: 'Tanger',
      address: 'Zone Franche de Tanger',
      capacity: 3500,
      managerName: 'Nadia Benali',
      phone: '0622334455',
      status: 'Complet',
    },
    {
      id: 3,
      name: 'Entrepôt Marrakech',
      city: 'Marrakech',
      address: 'Zone Industrielle Sidi Ghanem',
      capacity: 2800,
      managerName: 'Omar El Idrissi',
      phone: '0633445566',
      status: 'Maintenance',
    },
  ]);

  warehouseForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    city: ['', Validators.required],
    address: ['', Validators.required],
    capacity: [1, [Validators.required, Validators.min(1)]],
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

    const formValue = this.warehouseForm.getRawValue();
    const name = formValue.name.trim();

    const warehouseAlreadyExists = this.dataSource.data.some(
      warehouse =>
        warehouse.id !== this.editingWarehouseId &&
        warehouse.name.toLowerCase() === name.toLowerCase()
    );

    if (warehouseAlreadyExists) {
      alert('Un entrepôt avec ce nom existe déjà.');
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
      this.dataSource.data = this.dataSource.data.map(warehouse =>
        warehouse.id === this.editingWarehouseId
          ? {
              id: warehouse.id,
              ...warehouseData,
            }
          : warehouse
      );
    } else {
      const newWarehouse: Warehouse = {
        id: this.getNextId(),
        ...warehouseData,
      };

      this.dataSource.data = [...this.dataSource.data, newWarehouse];
    }

    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
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

    this.dataSource.data = this.dataSource.data.filter(
      currentWarehouse => currentWarehouse.id !== warehouse.id
    );

    if (this.selectedWarehouse?.id === warehouse.id) {
      this.selectedWarehouse = null;
    }

    if (this.editingWarehouseId === warehouse.id) {
      this.closeForm();
    }
  }

  private getNextId(): number {
    const ids = this.dataSource.data.map(warehouse => warehouse.id);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
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