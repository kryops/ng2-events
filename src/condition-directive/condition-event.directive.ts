import {
    Directive, Renderer2, ElementRef, Input, EventEmitter, Output, OnChanges,
    OnDestroy, SimpleChanges
} from "@angular/core";

/**
 * Conditionally apply event listeners to an element
 *
 * Usage:
 * <button [ev-condition]="isActive()"
 *      ev-events="click"
 *      (ev-fire)="handleClick($event)">...</button>
 *
 * Notes:
 * The [ev-events] property can be either a string or an array of strings to handle multiple events
 */
@Directive({
    selector: '[ev-condition]',
    standalone: false,
})
export class ConditionEventDirective implements OnChanges, OnDestroy {

    @Input('ev-condition') condition: boolean;
    @Input('ev-events') events: string|string[];

    @Output('ev-fire') fire: EventEmitter<any> = new EventEmitter();


    private listeners: Function[] = [];


    constructor(private elm: ElementRef,
                private renderer: Renderer2) { }


    ngOnChanges(changes: SimpleChanges): void {
        this.unregisterAll();

        if(!this.condition || !this.events) return;

        const events = (typeof(this.events) === 'string')
            ? [this.events]
            : this.events;

        this.listeners = events.map(x => this.addListener(x));
    }

    ngOnDestroy(): void {
        this.unregisterAll();
    }


    private unregisterAll() {
        this.listeners.forEach(x => x());
        this.listeners = [];
    }

    private addListener(eventName: string): Function {
        const colon = eventName.indexOf(':');
        const handler = ($event: any) => this.fire.next($event);

        if(colon === -1) {
            return this.renderer.listen(this.elm.nativeElement, eventName, handler);
        }
        else {
            const scope = eventName.slice(0, colon);
            const realEventName = eventName.slice(colon+1);
            return this.renderer.listen(scope, realEventName, handler);
        }
    }

}
