import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";

/**
 * Listen to events without triggering change detection
 *
 * Usage:
 * <button (undetected.click)="handleClick()"></button>
 *
 * ...
 *
 * export class ExampleComponent implements OnInit {
 *
 *  constructor(private zone: NgZone) {}
 *
 *  handleClick() {
 *      if(someCondition) {
 *          this.zone.run(() => {
 *              ...
 *          });
 *      }
 *  }
 * }
 *
 */
@Injectable()
export class UndetectedEventPlugin extends MyEventManagerPlugin {

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc)
    }

    supports(eventName: string): boolean {
        return eventName.indexOf('undetected.') === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {

        const realEventName = eventName.slice(11);

        return this.manager.getZone().runOutsideAngular(() =>
            this.manager.addEventListener(element, realEventName, handler));
    }
}
