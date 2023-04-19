import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  BehaviorSubject,
  combineLatest,
  map,
  scan,
  debounceTime,
  startWith,
  Subject,
} from 'rxjs';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Hello from {{name}}!</h1>
    <section>
      <button data-label="-" (click)="sum$.next(-1)"></button>
      <span> {{ count$ | async }} </span>
      <button data-label="+" (click)="sum$.next(+1)"></button>
    </section>
    <h5>Request sent: {{request$ | async}}</h5>
    <h6 *ngIf="loading$ | async"> ... loading </h6>
  `,
  styleUrls: ['./my-styles.scss'],
})
export class App {
  name = 'Angular';
  sum$ = new Subject<number>();
  count$ = this.sum$.pipe(scan((acc, curr) => acc + curr));
  request$ = this.count$.pipe(debounceTime(1000));
  loading$ = combineLatest([
    this.count$,
    this.request$.pipe(startWith(0)),
  ]).pipe(map(([count, req]) => count !== req));

  constructor() {}
}

bootstrapApplication(App);
