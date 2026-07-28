import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

type ReportPeriod =
  | 'Mois en cours'
  | 'Mois précédent'
  | 'Trimestre en cours'
  | 'Année en cours';

interface ReportMetrics {
  totalShipments: number;
  deliveredShipments: number;
  inTransitShipments: number;
  delayedShipments: number;
  cancelledShipments: number;
  totalTrucks: number;
  activeTrucks: number;
  availableDrivers: number;
  maintenanceCost: number;
}

interface PerformanceRecord {
  period: string;
  shipments: number;
  delivered: number;
  delayed: number;
  revenue: number;
}

interface RouteRecord {
  route: string;
  shipments: number;
  averageDuration: string;
  deliveryRate: number;
}

interface ReportData {
  metrics: ReportMetrics;
  performance: PerformanceRecord[];
  routes: RouteRecord[];
}

const REPORTS_DATA: Record<ReportPeriod, ReportData> = {
  'Mois en cours': {
    metrics: {
      totalShipments: 128,
      deliveredShipments: 96,
      inTransitShipments: 18,
      delayedShipments: 9,
      cancelledShipments: 5,
      totalTrucks: 30,
      activeTrucks: 24,
      availableDrivers: 21,
      maintenanceCost: 48500,
    },
    performance: [
      {
        period: 'Semaine 1',
        shipments: 28,
        delivered: 22,
        delayed: 2,
        revenue: 112000,
      },
      {
        period: 'Semaine 2',
        shipments: 34,
        delivered: 25,
        delayed: 3,
        revenue: 136000,
      },
      {
        period: 'Semaine 3',
        shipments: 31,
        delivered: 24,
        delayed: 2,
        revenue: 124000,
      },
      {
        period: 'Semaine 4',
        shipments: 35,
        delivered: 25,
        delayed: 2,
        revenue: 140000,
      },
    ],
    routes: [
      {
        route: 'Casablanca → Rabat',
        shipments: 34,
        averageDuration: '1 h 30',
        deliveryRate: 94,
      },
      {
        route: 'Casablanca → Marrakech',
        shipments: 29,
        averageDuration: '3 h 20',
        deliveryRate: 86,
      },
      {
        route: 'Tanger → Fès',
        shipments: 24,
        averageDuration: '4 h 10',
        deliveryRate: 88,
      },
      {
        route: 'Rabat → Agadir',
        shipments: 18,
        averageDuration: '5 h 45',
        deliveryRate: 83,
      },
    ],
  },

  'Mois précédent': {
    metrics: {
      totalShipments: 114,
      deliveredShipments: 88,
      inTransitShipments: 14,
      delayedShipments: 8,
      cancelledShipments: 4,
      totalTrucks: 30,
      activeTrucks: 23,
      availableDrivers: 20,
      maintenanceCost: 42100,
    },
    performance: [
      {
        period: 'Semaine 1',
        shipments: 25,
        delivered: 20,
        delayed: 2,
        revenue: 100000,
      },
      {
        period: 'Semaine 2',
        shipments: 29,
        delivered: 23,
        delayed: 2,
        revenue: 116000,
      },
      {
        period: 'Semaine 3',
        shipments: 27,
        delivered: 21,
        delayed: 2,
        revenue: 108000,
      },
      {
        period: 'Semaine 4',
        shipments: 33,
        delivered: 24,
        delayed: 2,
        revenue: 132000,
      },
    ],
    routes: [
      {
        route: 'Casablanca → Rabat',
        shipments: 30,
        averageDuration: '1 h 35',
        deliveryRate: 91,
      },
      {
        route: 'Casablanca → Marrakech',
        shipments: 26,
        averageDuration: '3 h 30',
        deliveryRate: 84,
      },
      {
        route: 'Tanger → Fès',
        shipments: 21,
        averageDuration: '4 h 20',
        deliveryRate: 85,
      },
      {
        route: 'Rabat → Agadir',
        shipments: 16,
        averageDuration: '5 h 55',
        deliveryRate: 81,
      },
    ],
  },

  'Trimestre en cours': {
    metrics: {
      totalShipments: 356,
      deliveredShipments: 279,
      inTransitShipments: 38,
      delayedShipments: 25,
      cancelledShipments: 14,
      totalTrucks: 30,
      activeTrucks: 25,
      availableDrivers: 22,
      maintenanceCost: 136500,
    },
    performance: [
      {
        period: 'Mai 2026',
        shipments: 109,
        delivered: 85,
        delayed: 8,
        revenue: 436000,
      },
      {
        period: 'Juin 2026',
        shipments: 119,
        delivered: 98,
        delayed: 8,
        revenue: 476000,
      },
      {
        period: 'Juillet 2026',
        shipments: 128,
        delivered: 96,
        delayed: 9,
        revenue: 512000,
      },
    ],
    routes: [
      {
        route: 'Casablanca → Rabat',
        shipments: 92,
        averageDuration: '1 h 32',
        deliveryRate: 93,
      },
      {
        route: 'Casablanca → Marrakech',
        shipments: 78,
        averageDuration: '3 h 25',
        deliveryRate: 85,
      },
      {
        route: 'Tanger → Fès',
        shipments: 65,
        averageDuration: '4 h 15',
        deliveryRate: 87,
      },
      {
        route: 'Rabat → Agadir',
        shipments: 49,
        averageDuration: '5 h 50',
        deliveryRate: 82,
      },
    ],
  },

  'Année en cours': {
    metrics: {
      totalShipments: 812,
      deliveredShipments: 654,
      inTransitShipments: 72,
      delayedShipments: 58,
      cancelledShipments: 28,
      totalTrucks: 30,
      activeTrucks: 26,
      availableDrivers: 23,
      maintenanceCost: 318000,
    },
    performance: [
      {
        period: 'Janvier',
        shipments: 92,
        delivered: 75,
        delayed: 6,
        revenue: 368000,
      },
      {
        period: 'Février',
        shipments: 98,
        delivered: 80,
        delayed: 7,
        revenue: 392000,
      },
      {
        period: 'Mars',
        shipments: 105,
        delivered: 84,
        delayed: 8,
        revenue: 420000,
      },
      {
        period: 'Avril',
        shipments: 102,
        delivered: 82,
        delayed: 7,
        revenue: 408000,
      },
      {
        period: 'Mai',
        shipments: 109,
        delivered: 85,
        delayed: 8,
        revenue: 436000,
      },
      {
        period: 'Juin',
        shipments: 119,
        delivered: 98,
        delayed: 8,
        revenue: 476000,
      },
      {
        period: 'Juillet',
        shipments: 87,
        delivered: 70,
        delayed: 6,
        revenue: 348000,
      },
    ],
    routes: [
      {
        route: 'Casablanca → Rabat',
        shipments: 214,
        averageDuration: '1 h 34',
        deliveryRate: 92,
      },
      {
        route: 'Casablanca → Marrakech',
        shipments: 176,
        averageDuration: '3 h 28',
        deliveryRate: 85,
      },
      {
        route: 'Tanger → Fès',
        shipments: 148,
        averageDuration: '4 h 18',
        deliveryRate: 86,
      },
      {
        route: 'Rabat → Agadir',
        shipments: 112,
        averageDuration: '5 h 52',
        deliveryRate: 82,
      },
    ],
  },
};

@Component({
  selector: 'app-reports',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {
  private readonly formBuilder = inject(FormBuilder);

  readonly periods: ReportPeriod[] = [
    'Mois en cours',
    'Mois précédent',
    'Trimestre en cours',
    'Année en cours',
  ];

  reportForm = this.formBuilder.nonNullable.group({
    period: [
      'Mois en cours' as ReportPeriod,
      Validators.required,
    ],
  });

  currentMetrics: ReportMetrics =
    REPORTS_DATA['Mois en cours'].metrics;

  generatedPeriod: ReportPeriod = 'Mois en cours';

  lastGeneratedAt = new Date().toLocaleString('fr-FR');

  performanceDisplayedColumns: string[] = [
    'period',
    'shipments',
    'delivered',
    'delayed',
    'revenue',
  ];

  routesDisplayedColumns: string[] = [
    'route',
    'shipments',
    'averageDuration',
    'deliveryRate',
  ];

  performanceDataSource =
    new MatTableDataSource<PerformanceRecord>(
      REPORTS_DATA['Mois en cours'].performance
    );

  routesDataSource =
    new MatTableDataSource<RouteRecord>(
      REPORTS_DATA['Mois en cours'].routes
    );

  get deliveryRate(): number {
    if (this.currentMetrics.totalShipments === 0) {
      return 0;
    }

    return Math.round(
      (
        this.currentMetrics.deliveredShipments /
        this.currentMetrics.totalShipments
      ) * 100
    );
  }

  get fleetAvailabilityRate(): number {
    if (this.currentMetrics.totalTrucks === 0) {
      return 0;
    }

    return Math.round(
      (
        this.currentMetrics.activeTrucks /
        this.currentMetrics.totalTrucks
      ) * 100
    );
  }

  get totalRevenue(): number {
    return this.performanceDataSource.data.reduce(
      (total, record) => total + record.revenue,
      0
    );
  }

  generateReport(): void {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const selectedPeriod =
      this.reportForm.controls.period.value;

    const selectedData = REPORTS_DATA[selectedPeriod];

    this.currentMetrics = {
      ...selectedData.metrics,
    };

    this.performanceDataSource.data = [
      ...selectedData.performance,
    ];

    this.routesDataSource.data = [
      ...selectedData.routes,
    ];

    this.generatedPeriod = selectedPeriod;
    this.lastGeneratedAt =
      new Date().toLocaleString('fr-FR');
  }

  formatMoney(value: number): string {
    return `${new Intl.NumberFormat('fr-FR').format(value)} MAD`;
  }

  exportCsv(): void {
    const separator = ';';

    const lines: string[] = [
      `Rapport TMS${separator}${this.generatedPeriod}`,
      `Généré le${separator}${this.lastGeneratedAt}`,
      '',
      `Indicateur${separator}Valeur`,
      `Total des expéditions${separator}${this.currentMetrics.totalShipments}`,
      `Expéditions livrées${separator}${this.currentMetrics.deliveredShipments}`,
      `Expéditions en transit${separator}${this.currentMetrics.inTransitShipments}`,
      `Expéditions retardées${separator}${this.currentMetrics.delayedShipments}`,
      `Expéditions annulées${separator}${this.currentMetrics.cancelledShipments}`,
      `Taux de livraison${separator}${this.deliveryRate}%`,
      `Camions actifs${separator}${this.currentMetrics.activeTrucks}`,
      `Chauffeurs disponibles${separator}${this.currentMetrics.availableDrivers}`,
      `Coût de maintenance${separator}${this.currentMetrics.maintenanceCost} MAD`,
      `Chiffre d’affaires${separator}${this.totalRevenue} MAD`,
      '',
      [
        'Période',
        'Expéditions',
        'Livrées',
        'Retardées',
        'Chiffre d’affaires',
      ].join(separator),
      ...this.performanceDataSource.data.map(record =>
        [
          record.period,
          record.shipments,
          record.delivered,
          record.delayed,
          `${record.revenue} MAD`,
        ].join(separator)
      ),
      '',
      [
        'Trajet',
        'Expéditions',
        'Durée moyenne',
        'Taux de livraison',
      ].join(separator),
      ...this.routesDataSource.data.map(route =>
        [
          route.route,
          route.shipments,
          route.averageDuration,
          `${route.deliveryRate}%`,
        ].join(separator)
      ),
    ];

    const csvContent = `\uFEFF${lines.join('\n')}`;

    const file = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = downloadUrl;
    link.download =
      `rapport-tms-${new Date().toISOString().slice(0, 10)}.csv`;

    link.click();

    URL.revokeObjectURL(downloadUrl);
  }

  printReport(): void {
    window.print();
  }
}