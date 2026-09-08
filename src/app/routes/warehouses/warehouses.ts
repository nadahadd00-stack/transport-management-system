import { Component, inject, OnInit } from '@angular/core';

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


export class Warehouses implements OnInit {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly warehousesService =
    inject(WarehousesService);


  warehouses: Warehouse[] = [];

  showForm = false;

  selectedWarehouse:
    Warehouse | null = null;

  editingWarehouseId:
    number | null = null;


  displayedColumns: string[] = [
    'name',
    'city',
    'capacity',
    'status',
    'actions',
  ];


  dataSource =
    new MatTableDataSource<Warehouse>([]);


  warehouseForm =
    this.formBuilder.nonNullable.group({

      name: [
        '',
        Validators.required,
      ],

      city: [
        '',
        Validators.required,
      ],

      address: [
        '',
        Validators.required,
      ],

      capacity: [
        1,
        [
          Validators.required,
          Validators.min(1),
        ],
      ],

      status: [
        'Actif',
        Validators.required,
      ],

    });


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadWarehouses();

  }


  // =====================================================
  // LOAD
  // =====================================================

  private loadWarehouses(): void {

    this.warehousesService
      .getAll()
      .subscribe({

        next: (data: Warehouse[]) => {

          this.warehouses = data;

          this.dataSource.data = data;

        },

        error: (error) => {

          console.error(
            'Erreur lors du chargement des entrepôts :',
            error
          );

          alert(
            'Impossible de charger les entrepôts.'
          );

        },

      });

  }


  // =====================================================
  // TOGGLE FORM
  // =====================================================

  toggleForm(): void {

    if (this.showForm) {

      this.closeForm();

      return;

    }

    this.openAddForm();

  }


  // =====================================================
  // ADD FORM
  // =====================================================

  openAddForm(): void {

    this.editingWarehouseId = null;

    this.selectedWarehouse = null;

    this.resetForm();

    this.showForm = true;

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.editingWarehouseId = null;

    this.resetForm();

  }


  // =====================================================
  // SAVE
  // =====================================================

  saveWarehouse(): void {

    if (this.warehouseForm.invalid) {

      this.warehouseForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.warehouseForm.getRawValue();


    const warehouseData:
      Omit<Warehouse, 'id'> = {

      name:
        formValue.name.trim(),

      city:
        formValue.city.trim(),

      address:
        formValue.address.trim(),

      capacity:
        formValue.capacity,

      status:
        formValue.status as Warehouse['status'],

    };


    // ===================================================
    // UPDATE
    // ===================================================

    if (this.editingWarehouseId !== null) {

      this.warehousesService
        .update(
          this.editingWarehouseId,
          warehouseData
        )
        .subscribe({

          next: () => {

            this.loadWarehouses();

            this.closeForm();

          },

          error: (error) => {

            console.error(
              'Erreur modification entrepôt :',
              error
            );

            alert(
              'Erreur lors de la modification de l’entrepôt.'
            );

          },

        });

      return;

    }


    // ===================================================
    // ADD
    // ===================================================

    this.warehousesService
      .add(warehouseData)
      .subscribe({

        next: () => {

          this.loadWarehouses();

          this.closeForm();

        },

        error: (error) => {

          console.error(
            'Erreur ajout entrepôt :',
            error
          );

          alert(
            'Erreur lors de l’ajout de l’entrepôt.'
          );

        },

      });

  }


  // =====================================================
  // FILTER
  // =====================================================

  applyFilter(event: Event): void {

    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();

  }


  // =====================================================
  // VIEW
  // =====================================================

  viewWarehouse(
    warehouse: Warehouse
  ): void {

    this.selectedWarehouse =
      warehouse;

    this.showForm = false;

    this.editingWarehouseId = null;

  }


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  closeWarehouseDetails(): void {

    this.selectedWarehouse = null;

  }


  // =====================================================
  // EDIT
  // =====================================================

  editWarehouse(
    warehouse: Warehouse
  ): void {

    this.selectedWarehouse = null;

    this.editingWarehouseId =
      warehouse.id;

    this.showForm = true;


    this.warehouseForm.setValue({

      name:
        warehouse.name,

      city:
        warehouse.city,

      address:
        warehouse.address,

      capacity:
        warehouse.capacity,

      status:
        warehouse.status,

    });

  }


  // =====================================================
  // DELETE
  // =====================================================

  deleteWarehouse(
    warehouse: Warehouse
  ): void {

    const confirmation =
      confirm(
        `Voulez-vous vraiment supprimer l’entrepôt ${warehouse.name} ?`
      );


    if (!confirmation) {

      return;

    }


    this.warehousesService
      .delete(warehouse.id)
      .subscribe({

        next: () => {

          this.loadWarehouses();

          if (
            this.selectedWarehouse?.id ===
            warehouse.id
          ) {

            this.selectedWarehouse = null;

          }

          if (
            this.editingWarehouseId ===
            warehouse.id
          ) {

            this.closeForm();

          }

        },

        error: (error) => {

          console.error(
            'Erreur suppression entrepôt :',
            error
          );

          alert(
            'Erreur lors de la suppression de l’entrepôt.'
          );

        },

      });

  }


  // =====================================================
  // RESET
  // =====================================================

  private resetForm(): void {

    this.warehouseForm.reset({

      name: '',

      city: '',

      address: '',

      capacity: 1,

      status: 'Actif',

    });

  }

}