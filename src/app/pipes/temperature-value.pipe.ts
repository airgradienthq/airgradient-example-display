import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperatureValue',
  standalone: true
})
export class TemperatureValuePipe implements PipeTransform {

  transform(tempCelsius: number, isFahrenheit: boolean): number {
    if (tempCelsius === null || tempCelsius === undefined) return tempCelsius;
    return isFahrenheit ? this.celsiusToFahrenheit(tempCelsius) : tempCelsius;
  }

  private celsiusToFahrenheit(celsius: number): number {
    if (celsius === null || celsius === undefined) return celsius;
    return (celsius * 9/5) + 32;
  }
}