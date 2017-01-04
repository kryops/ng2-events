import {Injectable} from "@angular/core";
import {EventManagerPlugin} from "@angular/platform-browser/src/dom/events/event_manager";

/**
 * Listen to events that are fired outside of the current element and its children
 *
 * Usage:
 * <div (outside.click)="close()"></div>
 *
 */
@Injectable()
export class OutsideEventPlugin extends EventManagerPlugin {

    supports(eventName: string): boolean {
        return eventName.indexOf('outside.') === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {

        const realEventName = eventName.slice(8);

        return this.manager.addGlobalEventListener('document', realEventName, (e: Event) => {
            if(element !== e.target && !element.contains(e.target as any)) {
                handler(e);
            }
        });
    }
}
