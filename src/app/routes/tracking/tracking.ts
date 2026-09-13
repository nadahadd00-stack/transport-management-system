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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

import { MatTooltipModule } from '@angular/material/tooltip';


import {
  TrackingRecord,
  TrackingService,
} from '../../core/services/tracking';



@Component({
  selector: 'app-tracking',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],

  templateUrl: './tracking.html',
  styleUrl: './tracking.scss',
})


export class Tracking implements OnInit {


  private readonly formBuilder =
    inject(FormBuilder);


  private readonly trackingService =
    inject(TrackingService);



  showForm = false;


  selectedTracking:
    TrackingRecord | null = null;


  editingTrackingId:
    number | null = null;



  displayedColumns: string[] = [

    'shipmentReference',
    'truck',
    'driver',
    'route',
    'currentLocation',
    'progress',
    'status',
    'actions',

  ];



  dataSource =
    new MatTableDataSource<TrackingRecord>([]);




  trackingForm =
    this.formBuilder.nonNullable.group({


      shipmentReference:[
        '',
        Validators.required
      ],


      truck:[
        '',
        Validators.required
      ],


      driver:[
        '',
        Validators.required
      ],


      origin:[
        '',
        Validators.required
      ],


      destination:[
        '',
        Validators.required
      ],


      currentLocation:[
        '',
        Validators.required
      ],


      progress:[
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],


      lastUpdate:[
        '',
        Validators.required
      ],


      status:[
        'En attente',
        Validators.required
      ],


    });





  ngOnInit():void{

    this.loadTracking();

  }





  private loadTracking():void{


    this.trackingService
    .getAll()
    .subscribe({

      next:(data)=>{

        this.dataSource.data = data;

      },


      error:(err)=>{

        console.error(
          'Erreur chargement tracking',
          err
        );

      }

    });


  }






  toggleForm():void{


    if(this.showForm){

      this.closeForm();

      return;

    }


    this.openAddForm();


  }






  openAddForm():void{


    this.editingTrackingId = null;

    this.selectedTracking = null;

    this.resetForm();

    this.showForm = true;


  }







  closeForm():void{


    this.showForm = false;

    this.editingTrackingId = null;

    this.resetForm();


  }








  saveTracking():void{


    if(this.trackingForm.invalid){

      this.trackingForm.markAllAsTouched();

      return;

    }




    const value =
    this.trackingForm.getRawValue();




    const trackingData:
    Omit<TrackingRecord,'id'> = {


      shipmentReference:
      value.shipmentReference
      .trim()
      .toUpperCase(),


      truck:
      value.truck.trim(),


      driver:
      value.driver.trim(),


      origin:
      value.origin.trim(),


      destination:
      value.destination.trim(),


      currentLocation:
      value.currentLocation.trim(),


      progress:
      value.progress,


      lastUpdate:
      value.lastUpdate,


      status:
      value.status as TrackingRecord['status']


    };





    if(this.editingTrackingId !== null){


      this.trackingService
      .update(
        this.editingTrackingId,
        trackingData
      )
      .subscribe(()=>{


        this.loadTracking();

        this.closeForm();


      });



    }
    else{


      this.trackingService
      .add(trackingData)
      .subscribe({

        next:()=>{

          this.loadTracking();

          this.closeForm();

        },


        error:(err)=>{

          console.error(
            'SAVE ERROR',
            err
          );

        }


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







  viewTracking(
    tracking:TrackingRecord
  ):void{


    this.selectedTracking = tracking;

    this.showForm = false;


  }






  closeTrackingDetails():void{


    this.selectedTracking = null;


  }







  editTracking(
    tracking:TrackingRecord
  ):void{


    this.editingTrackingId =
    tracking.id;


    this.showForm = true;



    this.trackingForm.setValue({

      shipmentReference:
      tracking.shipmentReference,


      truck:
      tracking.truck,


      driver:
      tracking.driver,


      origin:
      tracking.origin,


      destination:
      tracking.destination,


      currentLocation:
      tracking.currentLocation,


      progress:
      tracking.progress,


      lastUpdate:
      tracking.lastUpdate,


      status:
      tracking.status,


    });


  }








  deleteTracking(
    tracking:TrackingRecord
  ):void{


    if(!confirm(
      `Supprimer le suivi ${tracking.shipmentReference} ?`
    )){

      return;

    }



    this.trackingService
    .delete(tracking.id)
    .subscribe(()=>{


      this.loadTracking();


    });


  }








  private resetForm():void{


    this.trackingForm.reset({

      shipmentReference:'',
      truck:'',
      driver:'',
      origin:'',
      destination:'',
      currentLocation:'',
      progress:0,
      lastUpdate:'',
      status:'En attente',

    });


  }


}