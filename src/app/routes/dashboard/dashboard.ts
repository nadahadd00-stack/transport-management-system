import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  status: 'En préparation' | 'En transit' | 'Livrée' | 'Retardée';
}

interface MaintenanceAlert {
  truck: string;
  maintenanceType: string;
  scheduledDate: string;
  workshop: string;
  status: 'Planifiée' | 'En cours' | 'Terminée';
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
  today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  deliveryRate = 78;
  fleetAvailabilityRate = 83;

  metrics: DashboardMetric[] = [
    {
      title: 'Total des camions',
      value: 30,
      subtitle: '24 camions actifs',
      icon: 'local_shipping',
      cssClass: 'trucks-card',
      route: '/trucks',
    },
    {
      title: 'Chauffeurs disponibles',
      value: 22,
      subtitle: '3 chauffeurs en mission',
      icon: 'person',
      cssClass: 'drivers-card',
      route: '/drivers',
    },
    {
      title: 'Expéditions en transit',
      value: 18,
      subtitle: '128 expéditions ce mois',
      icon: 'route',
      cssClass: 'shipments-card',
      route: '/shipments',
    },
    {
      title: 'Expéditions retardées',
      value: 9,
      subtitle: 'Action nécessaire',
      icon: 'warning',
      cssClass: 'delayed-card',
      route: '/tracking',
    },
    {
      title: 'Maintenances en cours',
      value: 3,
      subtitle: '5 interventions planifiées',
      icon: 'build',
      cssClass: 'maintenance-card',
      route: '/maintenance',
    },
    {
      title: 'Notifications non lues',
      value: 5,
      subtitle: '2 alertes prioritaires',
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

  recentShipments: RecentShipment[] = [
    {
      reference: 'EXP-2026-006',
      customer: 'Atlas Distribution',
      origin: 'Casablanca',
      destination: 'Rabat',
      driver: 'Youssef El Amrani',
      status: 'En transit',
    },
    {
      reference: 'EXP-2026-007',
      customer: 'Marrakech Logistics',
      origin: 'Casablanca',
      destination: 'Marrakech',
      driver: 'Hamza Benali',
      status: 'Retardée',
    },
    {
      reference: 'EXP-2026-008',
      customer: 'Tanger Import',
      origin: 'Tanger',
      destination: 'Fès',
      driver: 'Omar Alaoui',
      status: 'En préparation',
    },
    {
      reference: 'EXP-2026-009',
      customer: 'Rabat Commerce',
      origin: 'Rabat',
      destination: 'Agadir',
      driver: 'Nabil El Idrissi',
      status: 'Livrée',
    },
  ];

  maintenanceDisplayedColumns: string[] = [
    'truck',
    'maintenanceType',
    'scheduledDate',
    'workshop',
    'status',
  ];

  maintenanceAlerts: MaintenanceAlert[] = [
    {
      truck: '12345-A-6',
      maintenanceType: 'Vidange',
      scheduledDate: '2026-08-02',
      workshop: 'Garage Atlas',
      status: 'Planifiée',
    },
    {
      truck: '67890-B-7',
      maintenanceType: 'Freinage',
      scheduledDate: '2026-07-31',
      workshop: 'Auto Service Casablanca',
      status: 'En cours',
    },
    {
      truck: '11223-C-8',
      maintenanceType: 'Pneumatiques',
      scheduledDate: '2026-08-04',
      workshop: 'Pneu Express Tanger',
      status: 'Planifiée',
    },
  ];

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