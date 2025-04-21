import { CommonModule } from '@angular/common';
import { Component, DoCheck, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConditionEventDirective, ObserveEventDirective } from 'ng2-events';
import { Subject, throttleTime } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ConditionEventDirective,
    ObserveEventDirective,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, DoCheck {
  constructor(private zone: NgZone) {}

  changeDetection = 0;
  events: string[] = [];
  active = 'outside';

  ngOnInit() {
    this.observeSubject.pipe(throttleTime(1000)).subscribe(($event: Event) => {
      this.zone.run(() => this.addEvent($event.type, '(observe directive)'));
    });
  }

  ngDoCheck() {
    this.changeDetection++;
  }

  addEvent(type: string, message?: string) {
    const eventString =
      new Date().toLocaleTimeString() + ' ' + type + ' ' + (message || '');

    console.log(eventString);

    this.events.unshift(eventString);

    if (this.events.length > 20) {
      this.events = this.events.slice(0, 20);
    }
  }

  // scroll-in/scroll-out

  scrollImagesVisible: number[] = [];

  setScrollVisibility(index: number, visibility: boolean) {
    this.addEvent(
      visibility ? 'scroll-in' : 'scroll-out',
      'for element ' + index,
    );

    const i = this.scrollImagesVisible.indexOf(index);

    if (i === -1 && visibility) {
      this.scrollImagesVisible.push(index);
    } else if (i !== -1 && !visibility) {
      this.scrollImagesVisible.splice(i, 1);
    }
  }

  isScrollImageVisible(index: number) {
    return this.scrollImagesVisible.indexOf(index) !== -1;
  }

  // condition

  condition = true;

  toggleCondition() {
    this.condition = !this.condition;
  }

  // undetected

  undetectedCount = 0;

  undetectedClick() {
    this.addEvent('undetected.click');
    this.undetectedCount++;

    if (this.undetectedCount % 3 === 0)
      this.zone.run(() => {
        // do nothing
      });
  }

  // observe directive

  observeSubject = new Subject<Event>();
}
