import { Pipe, PipeTransform } from '@angular/core';

import { DisplayLocation } from 'src/app/models/display-data';

@Pipe({
  name: 'measuresAvailable'
})
export class MeasuresAvailablePipe implements PipeTransform {
  transform(location: DisplayLocation): boolean {
    if (!location) return false;

    const measurementFieldsList = [
      'pm02',
      'pi02',
      'rco2',
      'atmp',
      'atmp_fahrenheit',
      'rhum',
      'heatindex'
    ];

    // @ts-ignore
    return measurementFieldsList.some(field => location[field] !== null && location[field] !== undefined);
  }

}
