import { Component, OnDestroy, OnInit } from '@angular/core';
import {Observable, Subject} from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DisplayLocation } from 'src/app/models/display-data';
import { MessageService } from 'src/app/services/message.service';
import { AirMeasureConfig } from 'src/app/models/air-measure-config';
import { DisplayDataService } from 'src/app/services/display-data.service';
import {FormControl} from '@angular/forms';

const AIR_MEASURE_VALUES_COLORS_CONFIG: { [key: string]: AirMeasureConfig[] } = {
  pm02: [
    { index: 1, color: 'green',  max: 9, label: 'Good' },
    { index: 2, color: 'yellow', max: 35.4, label: 'Moderate' },
    { index: 3, color: 'orange', max: 55.4, label: 'Unhealthy' },
    { index: 4, color: 'red',    max: 125.4, label: 'Unhealthy' },
    { index: 5, color: 'purple', max: 225.4, label: 'Very Unhealthy' },
    { index: 6, color: 'brown',  max: 10000, label: 'Hazardous' },
  ],
  pi02: [
    { index: 1, color: 'green',  max: 50, label: 'Good' },
    { index: 2, color: 'yellow', max: 100, label: 'Moderate' },
    { index: 3, color: 'orange', max: 150, label: 'Unhealthy' },
    { index: 4, color: 'red',    max: 200, label: 'Unhealthy' },
    { index: 5, color: 'purple', max: 300, label: 'Very Unhealthy' },
    { index: 6, color: 'brown',  max: 500, label: 'Hazardous' },
  ],
  rco2: [
    { index: 1, color: 'green',  max: 800, label: 'Excellent' },
    { index: 2, color: 'yellow', max: 1000, label: 'Good' },
    { index: 3, color: 'orange', max: 1500, label: 'Moderate' },
    { index: 4, color: 'red',    max: 2000, label: 'Poor' },
    { index: 5, color: 'purple', max: 3000, label: 'Dangerous' },
    { index: 6, color: 'brown',  max: 10000, label: 'Hazardous' }
  ],
  tvoc: [
    { index: 1, color: 'green',  max: 44, label: 'Very Low' },
    { index: 2, color: 'yellow', max: 111, label: 'Low' },
    { index: 3, color: 'orange', max: 222, label: 'Moderate' },
    { index: 4, color: 'red',    max: 2222, label: 'Elevated' },
    { index: 5, color: 'purple', max: 22222, label: 'High' },
    { index: 6, color: 'brown',  max: 100000, label: 'Very High' }
  ],
  tvoc_index: [
    { index: 1, color: 'green',  max: 150, label: 'Low' },
    { index: 2, color: 'yellow', max: 250, label: 'Moderate' },
    { index: 3, color: 'orange', max: 400, label: 'Elevated' },
    { index: 4, color: 'red',    max: 500000, label: 'High' }
  ],
  nox_index: [
    { index: 1, color: 'green',  max: 20, label: 'Low' },
    { index: 2, color: 'yellow', max: 150, label: 'Moderate' },
    { index: 3, color: 'orange', max: 300, label: 'Elevated' },
    { index: 4, color: 'red',    max: 500000, label: 'High' }
  ],
  heatindex: [
    { index: 1, color: 'green',  max: 32,  label: 'Good' },
    { index: 2, color: 'yellow', max: 40,  label: 'Moderate' },
    { index: 3, color: 'orange', max: 53,  label: 'High' },
    { index: 4, color: 'red',    max: 1000,  label: 'Dangerous' },
  ],
  volt: [
    { index: 1, color: 'red',    max: 9,  label: 'Critical' },
    { index: 2, color: 'orange', max: 10,  label: 'Very Low' },
    { index: 3, color: 'yellow', max: 11,  label: 'Low' },
    { index: 4, color: 'green',  max: 12.6,  label: 'Normal' },
  ]
}

export function pmToUSAQI(pm02: number): number | null {

  let result = null;
  if (pm02 == null) {
    result = null;
  } else if (pm02 <= 9.0) {
    result = ((50 - 0) / (9.0 - .0) * (pm02 - .0) + 0);
  } else if (pm02 <= 35.4) {
    result = ((100 - 51) / (35.4 - 9.1) * (pm02 - 9.1) + 51);
  } else if (pm02 <= 55.4) {
    result = ((150 - 101) / (55.4 - 35.5) * (pm02 - 35.5) + 101);
  } else if (pm02 <= 125.4) {
    result = ((200 - 151) / (125.4 - 55.5) * (pm02 - 55.5) + 151);
  } else if (pm02 <= 225.4) {
    result = ((300 - 201) / (225.4 - 125.5) * (pm02 - 125.5) + 201);
  } else if (pm02 <= 325.4) {
    result = ((500 - 301) / (325.4 - 225.5) * (pm02 - 225.5) + 301);
  } else {
    result = 500;
  }
  // @ts-ignore
  if (result !== null && result < 0) {
    result = 0;
  }
  return result !== null ? Number(result.toFixed(1)) : null;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public indoorLocations?: any[];
  public outdoorLocations?: any[];
  private destroy$: Subject<void> = new Subject<void>();
  public today?: Date;
  public apiToken = new FormControl('');
  public loadingDisplayData: Observable<boolean> = this.displayData.loadingDisplayData$;

  constructor(
    private _messageService: MessageService,
    public displayData: DisplayDataService
  ) { }

  ngOnInit(): void {
    this._messageService
      .listenMessage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message: string) => {
        if (message === 'display_data_refreshed') {
          this.updateLocationsAndAverages();
          this.applyHeatIndexCalculations();
        }
      });

    this.today = new Date();
    this.loadSavedApiToken();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLocationsAndAverages(): void {
    if (!this.displayData.currentDisplayData) return;
    const indoor = this.displayData.currentDisplayData.filter(location => location.locationType === 'indoor');
    const outdoor = this.displayData.currentDisplayData.filter(location => location.locationType === 'outdoor');

    this.indoorLocations = indoor.map(location => {
      location.pi02 = pmToUSAQI(location.pm02_corrected);
      return location;
    });

    this.outdoorLocations = outdoor.map(location => {
      location.pi02 = pmToUSAQI(location.pm02_corrected);
      return location;
    });
  }

  private applyHeatIndexCalculations(): void {
    this.applyHeatIndexToLocations(this.indoorLocations);
    this.applyHeatIndexToLocations(this.outdoorLocations);
  }

  private applyHeatIndexToLocations(locations?: DisplayLocation[]): void {
    if (locations) {
      locations.forEach((location: DisplayLocation) => {
        if (!location.heatindex) {
          this.addHeatIndex(location);
        }
      });
    }
  }

  private addHeatIndex(location: DisplayLocation): void {
    const heatindexMeasures =
      this.calculateRothfuszHeatIndex(location.atmp, location.rhum);
    location.heatindex = heatindexMeasures.celsius;

    location.heatindex_clr = this.getColorByValue(location.heatindex, 'heatindex');
  }


  public getColorByValue(value: number, measure: string): string {
    const config: AirMeasureConfig[] = AIR_MEASURE_VALUES_COLORS_CONFIG[measure];
    config?.sort((a, b) => b.index - a.index);
    let color = '';
    config?.forEach(configItem => {
      if (value <= configItem.max) {
        color = configItem.color;
      }
    });

    return color;
  }


  public calculateRothfuszHeatIndex(tempC: number, RH: number): { celsius: number; fahrenheit: number } {

    if(tempC == null || RH == null) {
      return { celsius: tempC || 0, fahrenheit: RH || 0 };
    }
    const temperatureF: number = (tempC * 9/5) + 32;
    let HI;

    // Simple formula for heat index if below 80°F
    let simpleHI = 0.5 * (temperatureF + 61.0 + ((temperatureF - 68.0) * 1.2) + (RH * 0.094));

    // If the simple heat index is 80°F or above, apply full regression equation
    if (simpleHI >= 80) {
      HI = -42.379 +
        2.04901523 * temperatureF +
        10.14333127 * RH -
        0.22475541 * temperatureF * RH -
        0.00683783 * temperatureF * temperatureF -
        0.05481717 * RH * RH +
        0.00122874 * temperatureF * temperatureF * RH +
        0.00085282 * temperatureF * RH * RH -
        0.00000199 * temperatureF * temperatureF * RH * RH;

      // Adjustment for low humidity (RH < 13%) and T between 80°F and 112°F
      if (RH < 13 && temperatureF >= 80 && temperatureF <= 112) {
        let adjustment = ((13 - RH) / 4) * Math.sqrt((17 - Math.abs(temperatureF - 95)) / 17);
        HI -= adjustment;
      }

      // Adjustment for high humidity (RH > 85%) and T between 80°F and 87°F
      if (RH > 85 && temperatureF >= 80 && temperatureF <= 87) {
        let adjustment = ((RH - 85) / 10) * ((87 - temperatureF) / 5);
        HI += adjustment;
      }
    } else {
      // Apply the simpler formula if the calculated heat index is below 80°F
      HI = simpleHI;
    }

    const heatIndexC = (HI - 32) * 5/9;
    return { celsius: heatIndexC, fahrenheit: HI };
  }


  private loadSavedApiToken(): void {
    const savedToken = localStorage.getItem('airGradientApiToken');
    if (savedToken) {
      this.apiToken.setValue(savedToken);
      this.apiTokenManagement(savedToken);
    }
  }

  public apiTokenManagement(apiToken: string): void {
    if (!apiToken) return;
    localStorage.setItem('airGradientApiToken', apiToken);
    this.displayData.startGettingDisplayMeasuresData(apiToken);
  }
}
