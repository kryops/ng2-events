import { Inject, Injectable, DOCUMENT } from '@angular/core';

import { MyEventManagerPlugin } from './event-manager-plugin';

function getNativeEventNames(eventName: string): string[] {
  const supportsPointerEvents =
    typeof window !== 'undefined' && 'PointerEvent' in window;

  switch (eventName) {
    case 'up':
      return supportsPointerEvents ? ['pointerup'] : ['mouseup', 'touchend'];

    case 'down':
      return supportsPointerEvents
        ? ['pointerdown']
        : ['mousedown', 'touchstart'];

    case 'move':
      return supportsPointerEvents
        ? ['pointermove']
        : ['mousemove', 'touchmove'];

    default:
      return [];
  }
}

/**
 * Quick-firing 'up' and 'down' events that work cross-browser for mouse and touch events
 *
 * Usage:
 * ```
 * <button (down)="activate()" (up)="deactivate()"></button>
 * ```
 */
@Injectable()
export class TouchEventPlugin extends MyEventManagerPlugin {
  constructor(@Inject(DOCUMENT) doc: Document) {
    super(doc);
  }

  supports(eventName: string): boolean {
    return eventName === 'down' || eventName === 'up' || eventName === 'move';
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: ($event: unknown) => void,
  ): () => void {
    const eventListeners = getNativeEventNames(eventName).map((x) =>
      this.manager.addEventListener(element, x, (e: Event) => {
        // prevent default so only one of the event listeners is fired
        e.preventDefault();
        handler(e);
      }),
    );

    return () => {
      eventListeners.forEach((x) => x());
    };
  }
}
