import {Inject, Injectable} from "@angular/core";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";
import {DOCUMENT} from "@angular/common";

/**
 * Listen to events that are fired outside of the current element and its children
 *
 * Usage:
 * <div (outside.click)="close()"></div>
 *
 */
@Injectable()
export class OutsideEventPlugin extends MyEventManagerPlugin {

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc)
    }

    supports(eventName: string): boolean {
        return eventName.indexOf('outside.') === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {

        const realEventName = eventName.slice(8);

        return this.manager.addEventListener((element.ownerDocument || document) as any, realEventName, (e: Event) => {
            if(element !== e.target && !element.contains(e.target as any)) {
                handler(e);
            }
        });
    }
}
