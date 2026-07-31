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
export class Customers {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customersService = inject(CustomersService);

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

  dataSource = new MatTableDataSource<Customer>(
    this.customersService.getAll()
  );

  customerForm = this.formBuilder.nonNullable.group({
    companyName: ['', Validators.required],
    contactName: ['', Validators.required],
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
    city: ['', Validators.required],
    address: ['', Validators.required],
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
    this.editingCustomerId = null;
    this.selectedCustomer = null;
    this.resetForm();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingCustomerId = null;
    this.resetForm();
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue();

    const email = formValue.email
      .trim()
      .toLowerCase();

    const emailAlreadyExists =
      this.customersService.emailExists(
        email,
        this.editingCustomerId
      );

    if (emailAlreadyExists) {
      alert(
        'Un client avec cette adresse e-mail existe déjà.'
      );
      return;
    }

    const customerData: Omit<Customer, 'id'> = {
      companyName: formValue.companyName.trim(),
      contactName: formValue.contactName.trim(),
      phone: formValue.phone.trim(),
      email,
      city: formValue.city.trim(),
      address: formValue.address.trim(),
      status: formValue.status as Customer['status'],
    };

    if (this.editingCustomerId !== null) {
      this.customersService.update(
        this.editingCustomerId,
        customerData
      );
    } else {
      this.customersService.add(customerData);
    }

    this.refreshCustomers();
    this.closeForm();
  }

  applyFilter(event: Event): void {
    const value =
      (event.target as HTMLInputElement).value;

    this.dataSource.filter =
      value.trim().toLowerCase();
  }

  viewCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.showForm = false;
    this.editingCustomerId = null;
  }

  closeCustomerDetails(): void {
    this.selectedCustomer = null;
  }

  editCustomer(customer: Customer): void {
    this.selectedCustomer = null;
    this.editingCustomerId = customer.id;
    this.showForm = true;

    this.customerForm.setValue({
      companyName: customer.companyName,
      contactName: customer.contactName,
      phone: customer.phone,
      email: customer.email,
      city: customer.city,
      address: customer.address,
      status: customer.status,
    });
  }

  deleteCustomer(customer: Customer): void {
    const confirmation = confirm(
      `Voulez-vous vraiment supprimer le client ${customer.companyName} ?`
    );

    if (!confirmation) {
      return;
    }

    this.customersService.delete(customer.id);
    this.refreshCustomers();

    if (this.selectedCustomer?.id === customer.id) {
      this.selectedCustomer = null;
    }

    if (this.editingCustomerId === customer.id) {
      this.closeForm();
    }
  }

  private refreshCustomers(): void {
    this.dataSource.data =
      this.customersService.getAll();
  }

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