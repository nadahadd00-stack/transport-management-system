import { Component, inject, OnInit } from '@angular/core';

import {
  Warehouse,
  WarehousesService
} from '../../core/services/warehouses';
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
  Shipment,
  ShipmentsService,
} from '../../core/services/shipments';


import {
  Customer,
  CustomersService,
} from '../../core/services/customers';


import {
  Truck,
  TrucksService,
} from '../../core/services/trucks';


import {
  Driver,
  DriversService,
} from '../../core/services/drivers';



@Component({

  selector: 'app-shipments',

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

  templateUrl: './shipments.html',
  styleUrl: './shipments.scss',

})


export class Shipments implements OnInit {


private readonly formBuilder = inject(FormBuilder);

private readonly shipmentsService =
inject(ShipmentsService);

private readonly customersService =
inject(CustomersService);

private readonly trucksService =
inject(TrucksService);

private readonly driversService =
inject(DriversService);

private readonly warehousesService =
inject(WarehousesService);
warehouses: Warehouse[] = [];


customers: Customer[] = [];

trucks: Truck[] = [];

drivers: Driver[] = [];



selectedShipment: Shipment | null = null;

showForm = false;

editingShipmentId:number|null = null;



displayedColumns:string[] = [

'reference',
'destinationCity',
'status',
'actions'

];



dataSource =
new MatTableDataSource<Shipment>([]);





shipmentForm =
this.formBuilder.nonNullable.group({


reference:[
'',
Validators.required
],


customerId:[
0,
Validators.required
],


truckId:[
0,
Validators.required
],


driverId:[
0,
Validators.required
],


warehouseId:[
0,
Validators.required
],


destinationAddress:[
'',
Validators.required
],


destinationCity:[
'',
Validators.required
],


cargoWeight:[
0,
Validators.required
],


departureDate:[
'',
Validators.required
],


expectedArrival:[
'',
Validators.required
],


status:[
'En préparation',
Validators.required
]

});





ngOnInit():void{


this.loadShipments();

this.loadCustomers();

this.loadTrucks();

this.loadDrivers();

this.loadWarehouses();

}





private loadShipments(){

this.shipmentsService
.getAll()
.subscribe({

next:(data)=>{

this.dataSource.data=data;

},

error:(err)=>{

console.error(
'Erreur chargement livraisons',
err
);

}

});


}





private loadCustomers(){

this.customersService
.getAll()
.subscribe({

next:(data)=>{

this.customers=data;

}

});


}





private loadTrucks(){

this.trucksService
.getAll()
.subscribe({

next:(data)=>{

this.trucks=data;

}

});


}





private loadDrivers(){

this.driversService
.getAll()
.subscribe({

next:(data)=>{

this.drivers=data;

}

});


}
private loadWarehouses(){

  this.warehousesService
  .getAll()
  .subscribe({

    next:(data: Warehouse[])=>{

      this.warehouses = data;

    },

    error:(err)=>{

      console.error(
        'Erreur chargement entrepôts',
        err
      );

    }

  });

}







toggleForm(){

this.showForm=!this.showForm;


if(this.showForm){

this.resetForm();

}

}






saveShipment(){


if(this.shipmentForm.invalid){

this.shipmentForm.markAllAsTouched();

return;

}



const form =
this.shipmentForm.getRawValue();



const shipmentData: Omit<Shipment,'id'> = {

reference: form.reference,

customerId: Number(form.customerId),

truckId: Number(form.truckId),

driverId: Number(form.driverId),

warehouseId: Number(form.warehouseId),

destinationAddress: form.destinationAddress,

destinationCity: form.destinationCity,

cargoWeight: Number(form.cargoWeight),

departureDate: form.departureDate,

expectedArrival: form.expectedArrival,

status: form.status as Shipment['status']

};




if(this.editingShipmentId !== null){


this.shipmentsService
.update(
this.editingShipmentId,
shipmentData
)
.subscribe(()=>{

this.loadShipments();

this.closeForm();

});


}
else{


this.shipmentsService
.add(shipmentData)
.subscribe(()=>{

this.loadShipments();

this.closeForm();

});


}



}






editShipment(shipment:Shipment){


this.editingShipmentId =
shipment.id;


this.showForm=true;



this.shipmentForm.setValue({


reference:shipment.reference,

customerId:shipment.customerId,

truckId:shipment.truckId,

driverId:shipment.driverId,

warehouseId:shipment.warehouseId,

destinationAddress:
shipment.destinationAddress,

destinationCity:
shipment.destinationCity,

cargoWeight:
shipment.cargoWeight,

departureDate:
shipment.departureDate,

expectedArrival:
shipment.expectedArrival,

status:
shipment.status


});


}







deleteShipment(shipment:Shipment){


if(confirm(
'Supprimer cette livraison ?'
)){


this.shipmentsService
.delete(shipment.id)
.subscribe(()=>{

this.loadShipments();

});


}


}






viewShipment(shipment:Shipment){

this.selectedShipment=shipment;

}





closeShipmentDetails(){

this.selectedShipment=null;

}





closeForm(){

this.showForm=false;

this.editingShipmentId=null;

this.resetForm();

}





applyFilter(event:Event){

const value =
(event.target as HTMLInputElement).value;


this.dataSource.filter =
value.trim().toLowerCase();


}






private resetForm(){

this.shipmentForm.reset({

reference:'',

customerId:0,

truckId:0,

driverId:0,

warehouseId:0,

destinationAddress:'',

destinationCity:'',

cargoWeight:0,

departureDate:'',

expectedArrival:'',

status:'En préparation'

});


}


}