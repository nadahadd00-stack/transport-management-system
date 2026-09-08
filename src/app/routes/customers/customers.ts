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
  Customer,
  CustomersService,
} from '../../core/services/customers';


@Component({
  selector: 'app-customers',

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

  templateUrl: './customers.html',

  styleUrl: './customers.scss',
})


export class Customers implements OnInit {

  private readonly formBuilder =
    inject(FormBuilder);

  private readonly customersService =
    inject(CustomersService);


  customers: Customer[] = [];

  showForm = false;

  selectedCustomer: Customer | null = null;

  editingCustomerId: number | null = null;


  displayedColumns: string[] = [
    'companyName',
    'contactName',
    'phone',
    'email',
    'city',
    'status',
    'actions',
  ];


  dataSource =
    new MatTableDataSource<Customer>([]);


  customerForm =
    this.formBuilder.nonNullable.group({

      companyName: [
        '',
        Validators.required,
      ],

      contactName: [
        '',
        Validators.required,
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/),
        ],
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],

      city: [
        '',
        Validators.required,
      ],

      address: [
        '',
        Validators.required,
      ],

      status: [
        'Actif',
        Validators.required,
      ],

    });


  // =====================================================
  // INITIALISATION
  // =====================================================

  ngOnInit(): void {

    this.loadCustomers();

  }


  // =====================================================
  // LOAD CUSTOMERS FROM BACKEND
  // =====================================================

  private loadCustomers(): void {

    this.customersService
      .getAll()
      .subscribe({

        next: (data: Customer[]) => {

          this.customers = data;

          this.dataSource.data = data;

        },

        error: (error) => {

          console.error(
            'Erreur lors du chargement des clients :',
            error
          );

          alert(
            'Impossible de charger les clients depuis le backend.'
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
  // OPEN ADD FORM
  // =====================================================

  openAddForm(): void {

    this.editingCustomerId = null;

    this.selectedCustomer = null;

    this.resetForm();

    this.showForm = true;

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.editingCustomerId = null;

    this.resetForm();

  }


  // =====================================================
  // SAVE CUSTOMER
  // =====================================================

  saveCustomer(): void {

    if (this.customerForm.invalid) {

      this.customerForm.markAllAsTouched();

      return;

    }


    const formValue =
      this.customerForm.getRawValue();


    const customerData:
      Omit<Customer, 'id'> = {

      companyName:
        formValue.companyName.trim(),

      contactName:
        formValue.contactName.trim(),

      phone:
        formValue.phone.trim(),

      email:
        formValue.email
          .trim()
          .toLowerCase(),

      city:
        formValue.city.trim(),

      address:
        formValue.address.trim(),

      status:
        formValue.status as Customer['status'],

    };


    // ===================================================
    // UPDATE CUSTOMER
    // ===================================================

    if (this.editingCustomerId !== null) {

      this.customersService
        .update(
          this.editingCustomerId,
          customerData
        )
        .subscribe({

          next: () => {

            this.loadCustomers();

            this.closeForm();

          },

          error: (error) => {

            console.error(
              'Erreur modification client :',
              error
            );

            alert(
              'Erreur lors de la modification du client.'
            );

          },

        });

      return;

    }


    // ===================================================
    // ADD CUSTOMER
    // ===================================================

    this.customersService
      .add(customerData)
      .subscribe({

        next: () => {

          this.loadCustomers();

          this.closeForm();

        },

        error: (error) => {

          console.error(
            'Erreur ajout client :',
            error
          );

          alert(
            'Erreur lors de l’ajout du client.'
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
  // VIEW CUSTOMER
  // =====================================================

  viewCustomer(
    customer: Customer
  ): void {

    this.selectedCustomer =
      customer;

    this.showForm = false;

    this.editingCustomerId = null;

  }


  // =====================================================
  // CLOSE CUSTOMER DETAILS
  // =====================================================

  closeCustomerDetails(): void {

    this.selectedCustomer = null;

  }


  // =====================================================
  // EDIT CUSTOMER
  // =====================================================

  editCustomer(
    customer: Customer
  ): void {

    this.selectedCustomer = null;

    this.editingCustomerId =
      customer.id;

    this.showForm = true;


    this.customerForm.setValue({

      companyName:
        customer.companyName,

      contactName:
        customer.contactName,

      phone:
        customer.phone,

      email:
        customer.email,

      city:
        customer.city,

      address:
        customer.address,

      status:
        customer.status,

    });

  }


  // =====================================================
  // DELETE CUSTOMER
  // =====================================================

  deleteCustomer(
    customer: Customer
  ): void {

    const confirmation =
      confirm(
        `Voulez-vous vraiment supprimer le client ${customer.companyName} ?`
      );


    if (!confirmation) {

      return;

    }


    this.customersService
      .delete(customer.id)
      .subscribe({

        next: () => {

          this.loadCustomers();


          if (
            this.selectedCustomer?.id ===
            customer.id
          ) {

            this.selectedCustomer = null;

          }


          if (
            this.editingCustomerId ===
            customer.id
          ) {

            this.closeForm();

          }

        },

        error: (error) => {

          console.error(
            'Erreur suppression client :',
            error
          );

          alert(
            'Erreur lors de la suppression du client.'
          );

        },

      });

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  private resetForm(): void {

    this.customerForm.reset({

      companyName: '',

      contactName: '',

      phone: '',

      email: '',

      city: '',

      address: '',

      status: 'Actif',

    });

  }

}