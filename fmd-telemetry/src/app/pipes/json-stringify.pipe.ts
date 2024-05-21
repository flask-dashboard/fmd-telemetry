import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonStringifyPipe'
})
export class JsonStringifyPipe implements PipeTransform {
  transform(value: any): string {
    return JSON.stringify(value, null, 2); // format with indentation
  }
}
