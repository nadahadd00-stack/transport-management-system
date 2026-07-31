import { Injectable } from '@angular/core';

export interface Customer {
  id: number;
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  status: 'Actif' | 'Inactif';
}

const STORAGE_KEY = 'tms_customers';

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 1,
    companyName: 'Atlas Distribution',
    contactName: 'Ahmed Benali',
    phone: '0611223344',
    email: 'contact@atlas.ma',
    city: 'Casablanca',
    address: 'Quartier Industriel, Casablanca',
    status: 'Actif',
  },
  {
    id: 2,
    companyName: 'Marrakech Logistics',
    contactName: 'Salma El Idrissi',
    phone: '0622334455',
    email: 'contact@marrakech-logistics.ma',
    city: 'Marrakech',
    address: 'Zone Industrielle Sidi Ghanem, Marrakech',
    status: 'Actif',
  },
  {
    id: 3,
    companyName: 'Tanger Import',
    contactName: 'Yassine Alaoui',
    phone: '0633445566',
    email: 'contact@tanger-import.ma',
    city: 'Tanger',
    address: 'Zone Franche, Tanger',
    status: 'Inactif',
  },
];

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private customers: Customer[] = this.loadCustomers();

  getAll(): Customer[] {
    return this.customers.map(customer => ({
      ...customer,
    }));
  }

  add(customerData: Omit<Customer, 'id'>): Customer {
    const newCustomer: Customer = {
      id: this.getNextId(),
      ...customerData,
    };

    this.customers = [
      ...this.customers,
      newCustomer,
    ];

    this.saveCustomers();

    return {
      ...newCustomer,
    };
  }

  update(
    customerId: number,
    customerData: Omit<Customer, 'id'>
  ): Customer | undefined {
    const customerExists = this.customers.some(
      customer => customer.id === customerId
    );

    if (!customerExists) {
      return undefined;
    }

    const updatedCustomer: Customer = {
      id: customerId,
      ...customerData,
    };

    this.customers = this.customers.map(customer =>
      customer.id === customerId
        ? updatedCustomer
        : customer
    );

    this.saveCustomers();

    return {
      ...updatedCustomer,
    };
  }

  delete(customerId: number): void {
    this.customers = this.customers.filter(
      customer => customer.id !== customerId
    );

    this.saveCustomers();
  }

  emailExists(
    email: string,
    excludedCustomerId: number | null = null
  ): boolean {
    const normalizedEmail =
      email.trim().toLowerCase();

    return this.customers.some(
      customer =>
        customer.id !== excludedCustomerId &&
        customer.email.trim().toLowerCase() ===
          normalizedEmail
    );
  }

  private getNextId(): number {
    const ids = this.customers.map(
      customer => customer.id
    );

    return ids.length > 0
      ? Math.max(...ids) + 1
      : 1;
  }

  private loadCustomers(): Customer[] {
    const savedCustomers =
      localStorage.getItem(STORAGE_KEY);

    if (!savedCustomers) {
      this.saveDefaultCustomers();

      return DEFAULT_CUSTOMERS.map(customer => ({
        ...customer,
      }));
    }

    try {
      const parsedCustomers =
        JSON.parse(savedCustomers) as Customer[];

      if (!Array.isArray(parsedCustomers)) {
        throw new Error('Format invalide');
      }

      return parsedCustomers;
    } catch {
      this.saveDefaultCustomers();

      return DEFAULT_CUSTOMERS.map(customer => ({
        ...customer,
      }));
    }
  }

  private saveCustomers(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(this.customers)
    );
  }

  private saveDefaultCustomers(): void {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_CUSTOMERS)
    );
  }
}