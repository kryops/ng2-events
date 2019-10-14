import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";

function getNativeEventNames(eventName: string): string[] {
    // iOS 13 supports both touch and pointer events,
    // and fires both even if we call preventDefault()
    const supportsPointerEvents = typeof(window) !== undefined && 'PointerEvent' in window;

    switch (eventName) {
        case 'up':
            return supportsPointerEvents
                ? ['pointerup']
                : ['mouseup', 'touchend'];

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
 * <button (down)="activate()" (up)="deactivate()"></button>
 *
 */
@Injectable()
export class TouchEventPlugin extends MyEventManagerPlugin {

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc)
    }

    supports(eventName: string): boolean {
        return eventName === 'down' || eventName === 'up' || eventName === 'move';
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
        const eventListeners = getNativeEventNames(eventName).map(x =>
            this.manager.addEventListener(element, x, (e: any) => {
                // prevent default so only one of the event listeners is fired
                e.preventDefault();
                handler(e);
            })
        );

        return () => {
            eventListeners.forEach(x => x());
        }
    }
}
