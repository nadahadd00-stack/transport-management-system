import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import {
  Truck,
  TrucksService
} from '../../core/services/trucks';

import {
  Driver,
  DriversService
} from '../../core/services/drivers';

import { ShipmentsService } from '../../core/services/shipments';
import { TrackingService } from '../../core/services/tracking';
import { MaintenanceService } from '../../core/services/maintenance';
import { NotificationsService } from '../../core/services/notifications';



interface DashboardMetric {
  title: string;
  value: number;
  subtitle: string;
  icon: string;
  cssClass: string;
  route: string;
}


interface RecentShipment {
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  driver: string;
  status: string;
}


interface MaintenanceAlert {
  truck: string;
  maintenanceType: string;
  scheduledDate: string;
  workshop: string;
  status: string;
}



@Component({
  selector: 'app-dashboard',
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})


export class Dashboard {


  private readonly trucksService =
    inject(TrucksService);


  private readonly driversService =
    inject(DriversService);


  private readonly shipmentsService =
    inject(ShipmentsService);


  private readonly trackingService =
    inject(TrackingService);


  private readonly maintenanceService =
    inject(MaintenanceService);


  private readonly notificationsService =
    inject(NotificationsService);



  private trucks: Truck[] = [];


  private drivers: Driver[] = [];


  private shipments: any[] = [];


  private trackingRecords: any[] = [];


  private maintenanceRecords: any[] = [];


  private notifications: any[] = [];



  constructor() {

    this.loadTrucks();
    this.loadDrivers();
    this.loadShipments();
    this.loadTracking();
    this.loadMaintenance();
    this.loadNotifications();

  }


private loadTrucks(): void {

  this.trucksService
    .getAll()
    .subscribe({

      next: (data: Truck[]) => {

        this.trucks = data;

      },

      error: (error) => {

        console.error(
          'Erreur chargement camions',
          error
        );

      }

    });

}



  private loadDrivers(): void {

    this.driversService
      .getAll()
      .subscribe(data => {

        this.drivers = data;

      });

  }


private loadShipments(): void {

  this.shipmentsService
    .getAll()
    .subscribe({

      next: (data) => {

        this.shipments = data;

      },

      error: (error) => {

        console.error(
          'Erreur chargement livraisons',
          error
        );

      }

    });

}


private loadTracking(): void {

  this.trackingService
  .getAll()
  .subscribe({
    next: (data) => {

      this.trackingRecords = data;

    },

    error: (error) => {

      console.error(
        'Erreur chargement tracking dashboard',
        error
      );

    }

  });

}


private loadMaintenance(): void {

  this.maintenanceService
    .getAll()
    .subscribe({

      next: (data) => {
        this.maintenanceRecords = data;
      },

      error: (error) => {
        console.error(
          'Erreur chargement maintenance',
          error
        );
      }

    });

}


private loadNotifications(): void {

  this.notificationsService
    .getAll()
    .subscribe({

      next: (data) => {
        this.notifications = data;
      },

      error: (error) => {
        console.error(
          'Erreur chargement notifications',
          error
        );
      }

    });

}



  today = new Date().toLocaleDateString(
    'fr-FR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  );



  get availableTrucks(): number {

  return this.trucks.filter(
    truck => truck.status === 'DISPONIBLE'
  ).length;

}



  get availableDrivers(): number {

  return this.drivers.filter(
    driver =>
      driver.status === 'Disponible'
  ).length;

}



 get driversOnMission(): number {

  return this.drivers.filter(
    driver =>
      driver.status === 'En mission'
  ).length;

}



 get shipmentsInTransit(): number {

  return this.shipments.filter(
    shipment =>
      shipment.status === 'IN_PROGRESS'
  ).length;

}



  get delayedShipments(): number {

    return this.trackingRecords.filter(
      tracking => tracking.status === 'Retardée'
    ).length;

  }



  get deliveredShipments(): number {

  return this.shipments.filter(
    shipment =>
      shipment.status === 'DELIVERED'
  ).length;

}




  get ongoingMaintenance(): number {

    return this.maintenanceRecords.filter(
      maintenance => maintenance.status === 'En cours'
    ).length;

  }



  get plannedMaintenance(): number {

    return this.maintenanceRecords.filter(
      maintenance => maintenance.status === 'Planifiée'
    ).length;

  }
   get unreadNotifications(): number {

    return this.notifications.filter(
      notification => notification.status === 'Non lue'
    ).length;

  }



  get priorityAlerts(): number {

    return this.notifications.filter(
      notification =>
        notification.status === 'Non lue' &&
        notification.priority === 'Élevée'
    ).length;

  }



  get deliveryRate(): number {

    return this.shipments.length > 0
      ? Math.round(
          (this.deliveredShipments /
            this.shipments.length) * 100
        )
      : 0;

  }



  get fleetAvailabilityRate(): number {

    return this.trucks.length > 0
      ? Math.round(
          (this.availableTrucks /
            this.trucks.length) * 100
        )
      : 0;

  }




  get deliveredShipmentsValue(): number {

    return this.deliveredShipments;

  }


get metrics(): DashboardMetric[] {
  return [
    {
      title: 'Total des camions',
      value: this.trucks.length,
      subtitle: `${this.availableTrucks} camions disponibles`,
      icon: 'local_shipping',
      cssClass: 'trucks-card',
      route: '/trucks',
    },

    {
      title: 'Chauffeurs disponibles',
      value: this.availableDrivers,
      subtitle: `${this.driversOnMission} chauffeurs en mission`,
      icon: 'person',
      cssClass: 'drivers-card',
      route: '/drivers',
    },

    {
      title: 'Expéditions en transit',
      value: this.shipmentsInTransit,
      subtitle: `${this.shipments.length} expéditions enregistrées`,
      icon: 'route',
      cssClass: 'shipments-card',
      route: '/shipments',
    },

    {
      title: 'Expéditions retardées',
      value: this.delayedShipments,
      subtitle:
        this.delayedShipments > 0
          ? 'Action nécessaire'
          : 'Aucun retard',
      icon: 'warning',
      cssClass: 'delayed-card',
      route: '/tracking',
    },

    {
      title: 'Maintenances en cours',
      value: this.ongoingMaintenance,
      subtitle: `${this.plannedMaintenance} interventions planifiées`,
      icon: 'build',
      cssClass: 'maintenance-card',
      route: '/maintenance',
    },

    {
      title: 'Notifications non lues',
      value: this.unreadNotifications,
      subtitle: `${this.priorityAlerts} alertes prioritaires`,
      icon: 'notifications_active',
      cssClass: 'notifications-card',
      route: '/notifications',
    },
  ];
}
  


  shipmentDisplayedColumns: string[] = [
    'reference',
    'customer',
    'route',
    'driver',
    'status',
  ];



  get recentShipments(): RecentShipment[] {

  return this.shipments
    .slice(-4)
    .reverse()
    .map(shipment => ({

      reference: shipment.reference,

      customer: `Client #${shipment.customerId}`,

      origin: `Entrepôt #${shipment.warehouseId}`,

      destination: shipment.destinationCity,

      driver: `Chauffeur #${shipment.driverId}`,

      status: shipment.status,

    }));

}





  maintenanceDisplayedColumns: string[] = [
    'truck',
    'maintenanceType',
    'scheduledDate',
    'workshop',
    'status',
  ];




  get maintenanceAlerts(): MaintenanceAlert[] {

    return this.maintenanceRecords
      .filter(
        maintenance =>
          maintenance.status !== 'Terminée' &&
          maintenance.status !== 'Annulée'
      )
      .slice(-3)
      .reverse()
      .map(maintenance => ({

        truck: maintenance.truck,

        maintenanceType:
          maintenance.maintenanceType,

        scheduledDate:
          maintenance.scheduledDate,

        workshop:
          maintenance.workshop,

        status:
          maintenance.status,

      }));

  }




  quickActions = [

    {
      label: 'Ajouter un camion',
      icon: 'local_shipping',
      route: '/trucks',
    },


    {
      label: 'Créer une expédition',
      icon: 'add_road',
      route: '/shipments',
    },


    {
      label: 'Consulter le suivi',
      icon: 'location_on',
      route: '/tracking',
    },


    {
      label: 'Voir les rapports',
      icon: 'bar_chart',
      route: '/reports',
    },

  ];


}