import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";

/**
 * Automatically unregister an event listener after the event fired once
 *
 * Usage:
 * <button (once.click)="foo()">...</button>
 *
 */
@Injectable()
export class OnceEventPlugin extends MyEventManagerPlugin {

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc)
    }

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
