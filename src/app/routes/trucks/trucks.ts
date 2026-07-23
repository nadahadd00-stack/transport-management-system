import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './trucks.html',
  styleUrl: './trucks.scss',
})
export class Trucks {
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

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  viewTruck(truck: Truck): void {
    console.log('Consulter le camion :', truck);
  }

  editTruck(truck: Truck): void {
    console.log('Modifier le camion :', truck);
  }

  deleteTruck(truck: Truck): void {
    console.log('Supprimer le camion :', truck);
  }
}