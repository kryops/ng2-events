import { Inject, Injectable, DOCUMENT } from '@angular/core';
import { MyEventManagerPlugin } from './event-manager-plugin';

/**
 * Listen to events that are fired outside of the current element and its children
 *
 * Usage:
 * ```
 * <div (outside.click)="close()"></div>
 * ```
 */
@Injectable()
export class OutsideEventPlugin extends MyEventManagerPlugin {
  constructor(@Inject(DOCUMENT) doc: Document) {
    super(doc);
  }

  supports(eventName: string): boolean {
    return eventName.indexOf('outside.') === 0;
  }

  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: ($event?: unknown) => void,
  ): () => void {
    const realEventName = eventName.slice(8);

    const removeEventListener = this.manager.addEventListener(
      (element.ownerDocument || document) as unknown as HTMLElement,
      realEventName,
      (e: Event) => {
        if (
          element !== e.target &&
          !element.contains(e.target as Node | null)
        ) {
          handler(e);
        }
      },
    );
    return () => removeEventListener();
  }
}
