import { Injectable, Inject, InjectionToken, DOCUMENT } from '@angular/core';

import { MyEventManagerPlugin } from './event-manager-plugin';
import { Subject } from 'rxjs';
import { auditTime } from 'rxjs/operators';

export const SCROLL_EVENT_TIME = new InjectionToken('ScrollEventTime');

/**
 * Detects when an element is scrolled into or out of the viewport
 *
 * Usage:
 * ```
 * <div (scroll-in)="activate()" (scroll-out)="deactivate()">...</div>
 * ```
 *
 * The matching handler of the initial status is called upon attaching
 * to notify the element of its current status. `$event` is true for the
 * initial call, false otherwise
 *
 */
@Injectable()
export class ScrollEventPlugin extends MyEventManagerPlugin {
  private listeners: (() => void)[] = [];
  private globalListener: (() => void) | undefined = undefined;

  private subject = new Subject<void>();

  constructor(
    @Inject(DOCUMENT) doc: Document,
    @Inject(SCROLL_EVENT_TIME) time: number,
  ) {
    super(doc);

    this.subject.pipe(auditTime(time)).subscribe(() => {
      this.listeners.forEach((x) => x());
    });
  }

  supports(eventName: string): boolean {
    return eventName === 'scroll-in' || eventName === 'scroll-out';
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: ($event?: unknown) => void,
  ): () => void {
    const isScrollIn = eventName === 'scroll-in';
    let status: boolean | undefined = undefined;

    setTimeout(() => {
      status = this.getStatus(element);

      if ((isScrollIn && status) || (!isScrollIn && !status)) {
        handler(true);
      }
    }, 0);

    const listener = () => {
      const newStatus = this.getStatus(element);

      if (status === newStatus) return;

      if ((isScrollIn && newStatus) || (!isScrollIn && !newStatus)) {
        this.manager.getZone().run(() => handler(false));
      }

      status = newStatus;
    };

    this.listeners.push(listener);
    this.updateGlobalListener();

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index === -1) return;

      this.listeners.splice(index, 1);
      this.updateGlobalListener();
    };
  }

  private updateGlobalListener() {
    if (this.listeners.length && this.globalListener === undefined) {
      this.manager.getZone().runOutsideAngular(() => {
        const handler = () => {
          this.subject.next();
        };

        const listeners = ['scroll', 'resize', 'orientationchange'].map((x) =>
          this.manager.addEventListener(
            (this._doc.defaultView || window) as unknown as HTMLElement,
            x,
            handler,
          ),
        );

        this.globalListener = () => {
          listeners.forEach((x) => x());
        };
      });
    } else if (!this.listeners.length && this.globalListener !== undefined) {
      this.globalListener();
      this.globalListener = undefined;
    }
  }

  private getStatus(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.bottom >= 0 && rect.top <= window.innerHeight;
  }
}
