import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readyTagStyle',
  standalone: true,
})
export class ReadyTagStylePipe implements PipeTransform {
  transform(value: boolean): string {
    if (value) return 'success';
    return 'danger';
  }
}
