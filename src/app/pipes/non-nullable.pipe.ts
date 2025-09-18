import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nonNullablePipe'
})
export class NonNullablePipe implements PipeTransform {

  transform(value: unknown, checkForUndefined = false): boolean {
    if (checkForUndefined) {
      return value !== null && value !== undefined && !Number.isNaN(value);
    }
   return value !== null && !Number.isNaN(value);
  }
}
