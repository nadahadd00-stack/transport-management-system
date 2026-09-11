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


export class Trucks implements OnInit {


  private readonly formBuilder =
    inject(FormBuilder);


  private readonly trucksService =
    inject(TrucksService);



  trucks: Truck[] = [];


  dataSource =
    new MatTableDataSource<Truck>([]);



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
    'actions'

  ];




  truckForm =
    this.formBuilder.nonNullable.group({


      registrationNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],


      brand: [
        '',
        Validators.required
      ],


      model: [
        '',
        Validators.required
      ],


      manufactureYear: [
        new Date().getFullYear(),
        [
          Validators.required,
          Validators.min(1980),
          Validators.max(
            new Date().getFullYear()
          )
        ]
      ],


      capacity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],


      fuelType: [
        'Diesel',
        Validators.required
      ],


     status: [
  'DISPONIBLE',
  Validators.required
]

    });



  ngOnInit(): void {

    this.loadTrucks();

  }





  private loadTrucks(): void {


    this.trucksService
      .getAll()
      .subscribe({

        next:(data: Truck[])=>{


          this.trucks = data;


          this.dataSource.data = data;


        },


        error:(error)=>{


          console.error(
            'Erreur chargement camions',
            error
          );


        }

      });


  }





  toggleForm(): void {


    if(this.showForm){

      this.closeForm();

    }
    else{

      this.openAddForm();

    }


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


    if(this.truckForm.invalid){

      this.truckForm.markAllAsTouched();

      return;

    }



    const formValue =
      this.truckForm.getRawValue();




    const truckData:
      Omit<Truck,'id'> = {


      registrationNumber:
        formValue.registrationNumber
          .trim()
          .toUpperCase(),


      brand:
        formValue.brand.trim(),


      model:
        formValue.model.trim(),


      manufactureYear:
        formValue.manufactureYear,


      capacity:
        formValue.capacity,


      fuelType:
        formValue.fuelType,


      status:
        formValue.status as Truck['status']


    };





    if(this.editingTruckId !== null){


      this.trucksService
        .update(
          this.editingTruckId,
          truckData
        )
        .subscribe(()=>{


          this.loadTrucks();

          this.closeForm();


        });


    }
    else{


      this.trucksService
        .add(truckData)
        .subscribe(()=>{


          this.loadTrucks();

          this.closeForm();


        });


    }



  }





  applyFilter(event: Event): void {


    const value =
      (event.target as HTMLInputElement).value;



    this.dataSource.filter =
      value.trim().toLowerCase();



  }





  viewTruck(truck: Truck): void {


    this.selectedTruck = truck;


  }





  closeTruckDetails(): void {


    this.selectedTruck = null;


  }





  editTruck(truck: Truck): void {


    this.editingTruckId =
      truck.id;


    this.showForm = true;



    this.truckForm.setValue({


      registrationNumber:
        truck.registrationNumber,


      brand:
        truck.brand,


      model:
        truck.model,


      manufactureYear:
        truck.manufactureYear,


      capacity:
        truck.capacity,


      fuelType:
        truck.fuelType,


      status:
        truck.status


    });



  }





  deleteTruck(truck: Truck): void {



    const confirmation =
      confirm(
        `Voulez-vous vraiment supprimer le camion ${truck.registrationNumber} ?`
      );



    if(!confirmation){

      return;

    }




    this.trucksService
      .delete(truck.id)
      .subscribe(()=>{


        this.loadTrucks();


      });


  }





  private resetForm(): void {



    this.truckForm.reset({


      registrationNumber:'',


      brand:'',


      model:'',


      manufactureYear:
        new Date().getFullYear(),


      capacity:1,


      fuelType:'Diesel',


      status:'DISPONIBLE'


    });



  }



}