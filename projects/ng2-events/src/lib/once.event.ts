import { Inject, Injectable, DOCUMENT } from '@angular/core';

import { MyEventManagerPlugin } from './event-manager-plugin';

/**
 * Automatically unregister an event listener after the event fired once
 *
 * Usage:
 * ```
 * <button (once.click)="foo()">...</button>
 * ```
 */
@Injectable()
export class OnceEventPlugin extends MyEventManagerPlugin {
  constructor(@Inject(DOCUMENT) doc: Document) {
    super(doc);
  }

  supports(eventName: string): boolean {
    return eventName.indexOf('once.') === 0;
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: ($event?: unknown) => void,
  ): () => void {
    const realEventName = eventName.slice(5);
    let active = true;

    const eventListener = this.manager.addEventListener(
      element,
      realEventName,
      ($event: unknown) => {
        eventListener();
        active = false;
        handler($event);
      },
    );

    return () => {
      if (active) eventListener();
    };
  }
}
