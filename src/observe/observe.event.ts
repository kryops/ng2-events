import {Inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {Subject} from "rxjs/Subject";
import {MyEventManagerPlugin} from "../__util/event-manager-plugin";

/**
 * Control event listeners with an observable operator without triggering change detection
 * every time the event fires
 *
 * Usage:
 * <button (observe.throttleTime-500.click)="foo()"></button>
 *
 * The method used must be present on the Observable object
 * e.g. through an explicit import:
 * import 'rxjs/add/operator/throttleTime';
 *
 *
 * To get finer-grained control and the possibility to add multiple observable operators
 * use the ObserveEventDirective.
 */
@Injectable()
export class ObserveEventPlugin extends MyEventManagerPlugin {

    constructor(@Inject(DOCUMENT) doc: any) {
        super(doc)
    }

    supports(eventName: string): boolean {
        return eventName.indexOf('observe.') === 0;
    }

    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
        return this.manager.getZone().runOutsideAngular(() => {

            const eventRest = eventName.slice(8).split('.');

            const fnParts = eventRest[0].split('-');
            const fnName = fnParts[0];
            const fnArg = (fnParts.length > 1) ? +fnParts[1] : undefined;

            const delegateEvent = eventRest.slice(1).join('.');

            const subject = new Subject();
            let observable = subject.asObservable();

            if(observable[fnName]) {
                observable = (fnArg !== undefined)
                    ? observable[fnName](fnArg)
                    : observable[fnName]();
            }
            else {
                console.error('The function "' + fnName + '" does not exist on Observable!');
                return () => {};
            }

            observable.subscribe(x => this.manager.getZone().run(() => handler(x)));

            const listener = this.manager.addEventListener(element, delegateEvent, ($event: any) => {
                subject.next($event);
            });

            return () => {
                listener();
                subject.complete();
            }
        });
    }
}
