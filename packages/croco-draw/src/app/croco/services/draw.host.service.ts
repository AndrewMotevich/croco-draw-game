import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawHostService {
  tool$ = new BehaviorSubject('pen');
}
