import {
  Directive,
  Renderer2,
  ElementRef,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  OnDestroy,
} from '@angular/core';

/**
 * Conditionally apply event listeners to an element
 *
 * Usage:
 * ```
 * <button [ev-condition]="isActive()"
 *      ev-events="click"
 *      (ev-fire)="handleClick($event)">...</button>
 *```
 *
 * Notes:
 * The `[ev-events]` property can be either a string or an array of strings to handle multiple events
 */
@Directive({
  selector: '[ev-condition]',
  standalone: true,
})
export class ConditionEventDirective implements OnChanges, OnDestroy {
  @Input({ alias: 'ev-condition', required: true }) condition!: boolean;
  @Input({ alias: 'ev-events', required: true }) events!: string | string[];

  @Output('ev-fire') fire = new EventEmitter();

  private listeners: (() => void)[] = [];

  constructor(
    private elm: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    this.unregisterAll();

    if (!this.condition || !this.events) return;

    const events =
      typeof this.events === 'string' ? [this.events] : this.events;

    this.listeners = events.map((x) => this.addListener(x));
  }

  ngOnDestroy(): void {
    this.unregisterAll();
  }

  private unregisterAll() {
    this.listeners.forEach((x) => x());
    this.listeners = [];
  }

  private addListener(eventName: string): () => void {
    const colon = eventName.indexOf(':');
    const handler = ($event: unknown) => this.fire.next($event);

    if (colon === -1) {
      return this.renderer.listen(this.elm.nativeElement, eventName, handler);
    } else {
      const scope = eventName.slice(0, colon);
      const realEventName = eventName.slice(colon + 1);
      return this.renderer.listen(scope, realEventName, handler);
    }
  }
}
