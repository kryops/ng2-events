import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";

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
        return eventName === 'down' || eventName === 'up';
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {

        const eventNames = (eventName === 'down')
            ? ['mousedown', 'touchstart', 'pointerdown']
            : ['mouseup', 'touchend', 'pointerup'];

        const eventListeners = eventNames.map(x =>
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
