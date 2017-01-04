import {Injectable} from "@angular/core";
import {EventManagerPlugin} from "@angular/platform-browser/src/dom/events/event_manager";

/**
 * Automatically unregister an event listener after the event fired once
 *
 * Usage:
 * <button (once.click)="foo()">...</button>
 *
 */
@Injectable()
export class OnceEventPlugin extends EventManagerPlugin {

    supports(eventName: string): boolean {
        return eventName.indexOf('once.') === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {

        const realEventName = eventName.slice(5);
        let active = true;

        const eventListener = this.manager.addEventListener(element, realEventName, ($event: any) => {
            eventListener();
            active = false;
            handler($event);
        });

        return () => {
            if(active) eventListener();
        }
    }
}
