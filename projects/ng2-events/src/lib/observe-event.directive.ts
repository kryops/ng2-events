import {
  Directive,
  Renderer2,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Pass events to a given observable subject without triggering change detection
 *
 * Usage:
 * ```
 * <button [ev-observe]="subject" ev-events="click"></button>
 *
 * // ...
 *
 * export class ExampleComponent implements OnInit {
 *  public subject = new Subject();
 *
 *  constructor(private zone: NgZone) {}
 *
 *  ngOnInit() {
 *      this.subject
 *          .throttleTime(300)
 *          .filter(someCondition)
 *          ...
 *          .subscribe($event => this.zone.run(() => this.handleEvent($event)));
 *  }
 * }
 * ```
 *
 * Notes:
 * The `[ev-events]` property can be either a string or an array of strings to handle multiple events
 *
 */
@Directive({
  selector: '[ev-observe]',
  standalone: true,
})
export class ObserveEventDirective implements OnDestroy {
  @Input({ alias: 'ev-observe', required: true }) observe!: Subject<Event>;
  @Input({ alias: 'ev-events', required: true }) set events(
    e: string | string[],
  ) {
    this.unregisterAll();

    const events = typeof e === 'string' ? [e] : e;

    this.zone.runOutsideAngular(() => {
      this.listeners = events.map((x) => this.addListener(x));
    });
  }

  private listeners: (() => void)[] = [];

  constructor(
    private elm: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone,
  ) {}

  ngOnDestroy(): void {
    this.unregisterAll();
  }

  private unregisterAll() {
    this.listeners.forEach((x) => x());
    this.listeners = [];
  }

  private addListener(eventName: string): () => void {
    const colon = eventName.indexOf(':');
    const handler = ($event: Event) => this.fireEvent($event);

    if (colon === -1) {
      return this.renderer.listen(this.elm.nativeElement, eventName, handler);
    } else {
      const scope = eventName.slice(0, colon);
      const realEventName = eventName.slice(colon + 1);
      return this.renderer.listen(scope, realEventName, handler);
    }
  }

  private fireEvent($event: Event) {
    if (!this.observe) return;
    this.observe.next($event);
  }
}
