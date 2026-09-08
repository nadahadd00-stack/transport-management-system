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
  Driver,
  DriversService,
} from '../../core/services/drivers';


@Component({
  selector: 'app-drivers',
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
  templateUrl: './drivers.html',
  styleUrl: './drivers.scss',
})
export class Drivers {


  private readonly formBuilder = inject(FormBuilder);

  private readonly driversService =
    inject(DriversService);



  showForm = false;

  selectedDriver: Driver | null = null;

  editingDriverId: number | null = null;



  displayedColumns: string[] = [
    'fullName',
    'phone',
    'licenseNumber',
    'status',
    'actions',
  ];



  dataSource =
    new MatTableDataSource<Driver>([]);



  constructor() {
    this.loadDrivers();
  }



  private loadDrivers(): void {

    this.driversService
      .getAll()
      .subscribe(drivers => {

        this.dataSource.data = drivers;

      });

  }



  driverForm =
    this.formBuilder.nonNullable.group({

      fullName: [
        '',
        Validators.required
      ],

      cin: [
        '',
        Validators.required
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],


      licenseNumber: [
        '',
        Validators.required
      ],


      licenseCategory: [
        'C',
        Validators.required
      ],


      experienceYears: [
        0,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],


      status: [
        'Disponible',
        Validators.required
      ],

    });



  toggleForm(): void {

    if(this.showForm){

      this.closeForm();

    }
    else{

      this.openAddForm();

    }

  }




  openAddForm(): void {

    this.editingDriverId = null;

    this.selectedDriver = null;

    this.resetForm();

    this.showForm = true;

  }



  closeForm(): void {

    this.showForm = false;

    this.editingDriverId = null;

    this.resetForm();

  }




  saveDriver(): void {


    if(this.driverForm.invalid){

      this.driverForm.markAllAsTouched();

      return;

    }



    const value =
      this.driverForm.getRawValue();



    const driverData: Omit<Driver,'id'> = {


      fullName:
        value.fullName.trim(),


      cin:
        value.cin.trim(),


      phone:
        value.phone.trim(),


      licenseNumber:
        value.licenseNumber.trim(),


      licenseCategory:
        value.licenseCategory,


      experienceYears:
        value.experienceYears,


      status:
        value.status as Driver['status'],

    };




    if(this.editingDriverId !== null){


      this.driversService
        .update(
          this.editingDriverId,
          driverData
        )
        .subscribe(()=>{

          this.loadDrivers();

          this.closeForm();

        });


    }
    else{


      this.driversService
        .add(driverData)
        .subscribe(()=>{

          this.loadDrivers();

          this.closeForm();

        });


    }


  }





  applyFilter(event:Event):void{


    const value =
      (event.target as HTMLInputElement)
      .value;


    this.dataSource.filter =
      value.trim().toLowerCase();


  }





  editDriver(driver:Driver):void{


    this.editingDriverId = driver.id;

    this.showForm = true;



    this.driverForm.patchValue({

      fullName: driver.fullName,

      cin: driver.cin,

      phone: driver.phone,

      licenseNumber:
        driver.licenseNumber,

      licenseCategory:
        driver.licenseCategory,

      experienceYears:
        driver.experienceYears,

      status:
        driver.status,

    });


  }





  deleteDriver(driver:Driver):void{


    const ok =
      confirm(
        `Supprimer ${driver.fullName} ?`
      );


    if(!ok){

      return;

    }



    this.driversService
      .delete(driver.id)
      .subscribe(()=>{

        this.loadDrivers();

      });


  }




  viewDriver(driver:Driver):void{

    this.selectedDriver = driver;

  }



  closeDriverDetails():void{

    this.selectedDriver = null;

  }



  private resetForm():void{


    this.driverForm.reset({

      fullName:'',

      cin:'',

      phone:'',

      licenseNumber:'',

      licenseCategory:'C',

      experienceYears:0,

      status:'Disponible',

    });


  }


}