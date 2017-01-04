import {Directive, Renderer, ElementRef, Input, NgZone} from "@angular/core";
import {Subject} from "rxjs/Subject";

/**
 * Pass events to a given observable subject without triggering change detection
 *
 * Usage:
 * <button [ev-observe]="subject" ev-events="click"></button>
 *
 * ...
 *
 * export class ExampleComponent implements OnInit {
 *  public subject = new Subject();
 *
 *  constructor(private zone: NgZone) {}
 *
 *  ngOnInit() {
 *      this.subject
 *          .throttleTime(300)
 *          .filter(someCondition)
 *          ...
 *          .subscribe($event => this.zone.run(() => this.handleEvent($event)));
 *  }
 * }
 *
 * Notes:
 * The [ev-events] property can be either a string or an array of strings to handle multiple events
 *
 */
@Directive({
    selector: '[ev-observe]'
})
export class ObserveEventDirective {

    @Input('ev-observe') observe: Subject<any>;
    @Input('ev-events') set events(e: string|string[]) {
        this.listeners.forEach(x => x());

        const events = (typeof(e) === 'string')
            ? [e]
            : e;

        this.zone.runOutsideAngular(() => {
            this.listeners = events.map(x =>
                this.renderer.listen(this.elm.nativeElement, x, ($event: any) => this.fireEvent($event)))
        });
    }

    private listeners: Function[] = [];


    constructor(private elm: ElementRef,
                private renderer: Renderer,
                private zone: NgZone) { }


    private fireEvent($event: any) {
        if(!this.observe) return;
        this.observe.next($event);
    }

}
