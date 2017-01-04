import {Injectable} from "@angular/core";
import {EventManagerPlugin} from "@angular/platform-browser/src/dom/events/event_manager";

/**
 * Quick-firing 'up' and 'down' events that work cross-browser for mouse and touch events
 *
 * Usage:
 * <button (down)="activate()" (up)="deactivate()"></button>
 *
 */
@Injectable()
export class TouchEventPlugin extends EventManagerPlugin {

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
