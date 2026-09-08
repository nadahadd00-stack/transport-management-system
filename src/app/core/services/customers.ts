import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Customer {

  id: number;

  companyName: string;

  contactName: string;

  phone: string;

  email: string;

  city: string;

  address: string;

  status:
    | 'Actif'
    | 'Inactif';

}


@Injectable({
  providedIn: 'root',
})
export class CustomersService {


  private readonly http =
    inject(HttpClient);


  private readonly apiUrl =
    'http://localhost:8081/clients';



  // =====================================================
  // GET ALL CLIENTS
  // =====================================================

  getAll(): Observable<Customer[]> {

    return this.http.get<Customer[]>(
      this.apiUrl
    );

  }



  // =====================================================
  // GET CLIENT BY ID
  // =====================================================

  getById(
    id: number
  ): Observable<Customer> {

    return this.http.get<Customer>(
      `${this.apiUrl}/${id}`
    );

  }



  // =====================================================
  // ADD CLIENT
  // =====================================================

  add(
    customerData: Omit<Customer, 'id'>
  ): Observable<Customer> {

    return this.http.post<Customer>(
      this.apiUrl,
      customerData
    );

  }



  // =====================================================
  // UPDATE CLIENT
  // =====================================================

  update(
    customerId: number,
    customerData: Omit<Customer, 'id'>
  ): Observable<Customer> {

    return this.http.put<Customer>(
      `${this.apiUrl}/${customerId}`,
      customerData
    );

  }



  // =====================================================
  // DELETE CLIENT
  // =====================================================

  delete(
    customerId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${customerId}`,
      {
        responseType: 'text'
      }
    );

  }



  // =====================================================
  // CHECK EMAIL
  // =====================================================

  emailExists(
    email: string,
    excludedCustomerId: number | null = null
  ): boolean {

    // Cette vérification était auparavant faite
    // dans le localStorage.
    //
    // Maintenant les clients sont gérés par le backend.
    //
    // On retourne false ici pour éviter de faire
    // une requête HTTP synchrone.

    return false;

  }

}