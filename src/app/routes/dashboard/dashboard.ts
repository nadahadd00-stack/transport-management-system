import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TrucksService } from '../../core/services/trucks';
import { DriversService } from '../../core/services/drivers';
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

  private readonly trucks =
    this.trucksService.getAll();

  private readonly drivers =
    this.driversService.getAll();

  private readonly shipments =
    this.shipmentsService.getAll();

  private readonly trackingRecords =
    this.trackingService.getAll();

  private readonly maintenanceRecords =
    this.maintenanceService.getAll();

  private readonly notifications =
    this.notificationsService.getAll();

  today = new Date().toLocaleDateString(
    'fr-FR',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }
  );

  private readonly availableTrucks =
    this.trucks.filter(
      truck => truck.status === 'Disponible'
    ).length;

  private readonly availableDrivers =
    this.drivers.filter(
      driver => driver.status === 'Disponible'
    ).length;

  private readonly driversOnMission =
    this.drivers.filter(
      driver => driver.status === 'En mission'
    ).length;

  private readonly shipmentsInTransit =
    this.shipments.filter(
      shipment =>
        shipment.status === 'En transit'
    ).length;

  private readonly delayedShipments =
    this.trackingRecords.filter(
      tracking =>
        tracking.status === 'Retardée'
    ).length;

  private readonly deliveredShipments =
    this.shipments.filter(
      shipment =>
        shipment.status === 'Livrée'
    ).length;

  private readonly ongoingMaintenance =
    this.maintenanceRecords.filter(
      maintenance =>
        maintenance.status === 'En cours'
    ).length;

  private readonly plannedMaintenance =
    this.maintenanceRecords.filter(
      maintenance =>
        maintenance.status === 'Planifiée'
    ).length;

  private readonly unreadNotifications =
    this.notifications.filter(
      notification =>
        notification.status === 'Non lue'
    ).length;

  private readonly priorityAlerts =
    this.notifications.filter(
      notification =>
        notification.status === 'Non lue' &&
        notification.priority === 'Élevée'
    ).length;

  deliveryRate =
    this.shipments.length > 0
      ? Math.round(
          (this.deliveredShipments /
            this.shipments.length) *
            100
        )
      : 0;

  fleetAvailabilityRate =
    this.trucks.length > 0
      ? Math.round(
          (this.availableTrucks /
            this.trucks.length) *
            100
        )
      : 0;

  metrics: DashboardMetric[] = [
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

  shipmentDisplayedColumns: string[] = [
    'reference',
    'customer',
    'route',
    'driver',
    'status',
  ];

  recentShipments: RecentShipment[] =
    this.shipments
      .slice(-4)
      .reverse()
      .map(shipment => ({
        reference: shipment.reference,
        customer: shipment.customer,
        origin: shipment.origin,
        destination: shipment.destination,
        driver: shipment.driver,
        status: shipment.status,
      }));

  maintenanceDisplayedColumns: string[] = [
    'truck',
    'maintenanceType',
    'scheduledDate',
    'workshop',
    'status',
  ];

  maintenanceAlerts: MaintenanceAlert[] =
    this.maintenanceRecords
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
        workshop: maintenance.workshop,
        status: maintenance.status,
      }));

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