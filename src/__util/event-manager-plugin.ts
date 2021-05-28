import {EventManager} from "@angular/platform-browser";

export abstract class MyEventManagerPlugin {
    constructor(protected _doc: Document) {}

    manager: EventManager;

    abstract supports(eventName: string): boolean;

    abstract addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;

    addGlobalEventListener(element: string, eventName: string, handler: Function): Function {
        let target: any;
        if(element === 'document') target = this._doc;
        else if(element === 'window' && typeof(window) !== undefined) target = window;

        if (!target) {
            throw new Error(`Unsupported event target ${target} for event ${eventName}`);
        }
        return this.addEventListener(target, eventName, handler);
    };
}
