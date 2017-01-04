Extensions to the Angular2 event handling to make use of additional events and allow for better control over change detection for high-performance applications:

*   Listen to events outside of the current element
*   Up/down event handlers for cross-browser touch/mouse events
*   Listen to multiple events with one handler
*   Listen to events without triggering change detection
*   Use Observables to fine-tune when to trigger change detection

**Examples**:

```html
<div (outside.click)="close()">...</div>

<button (down)="activate()" (up)="deactivate()">...</button>

<input (multi.focus,select)="foo($event)" />

<button (undetected.click)="handleUndetectedClick()">...</button>

<button (observe.throttleTime-500.click)="handleClick()">...</button>

<button [ev-observe]="subject" [ev-events]="['mousedown', 'mouseup']">...</button>
```


## Installation

```
npm install --save ng2-events
```

This package is distributed as CommonJS modules. If you use Rollup as your build system, you have to import it using the CommonJS plugin:

```js
import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default {
    // ...
    plugins: [
        nodeResolve({jsnext: true, module: true}),
        commonjs({ include: [
            'node_modules/rxjs/**',
            'node_modules/ng2-events/**'
        ]})
    ]
}
```

## Usage

To use all of the events, import the `Ng2EventsModule` into your application or shared `NgModule`:

```ts
import {NgModule} from "@angular/core";
import {Ng2EventsModule} from "ng2-events";

@NgModule({
    imports: [
        Ng2EventsModule
    ],
    exports: [
        Ng2EventsModule
    ]
})
export class SharedModule {}
```

The recommended way is to only import the sub-modules for the features you need.


## Additional Events

### *outside*: Listen to events outside of an element

Import the `OutsideEventModule` into your application to use this event handler.

```html
<div (outside.click)="close()">...</div>
```

The event handler is called when an event is fired outside of the element and its children.


### *up/down*: Cross-browser quick mouse/touch events

Import the `TouchEventModule` into your application to use this event handler.

```html
<button (down)="activate()" (up)="deactivate()">...</button>
```

The up/down events are fired when one of the following events is fired on the element:

*   mousedown/mouseup
*   pointerdown/pointerup
*   touchstart/touchend

Note that `preventDefault()` is called on the first event to occur to make sure that the event handler is only fired once. This prevents touch-enabled devices from firing the handler for both the `touchstart` and the `mousedown` event.


## Event Helpers

### *multi*: Listen to multiple events at once

Import the `MultiEventModule` into your application to use this event handler.

```html
<input (multi.focus,select)="foo($event)" />
```


## Change Detection

### *undetected*: Listen to events without triggering change detection

Import the `UndetectedEventModule` into your application to use this event handler.

```html
<button (undetected.click)="handleClick()">...</button>
```

```ts
export class ExampleComponent implements OnInit {
    
    constructor(private zone: NgZone) {}
    
    handleClick() {
      if(someCondition) {
          this.zone.run(() => {
              ...
          });
      }
    }
}
```

This adds the event listener outside of the Angular zone, thus change detection is not triggered until you manually call `NgZone.run()` or a different event is fired within the Angular zone.


### *observe*: Call an observable operator on events

Import the `ObserveEventModule` into your application to use this event handler.

```html
<button (observe.throttleTime-500.click)="handleClick()">...</button>
```

The method used must be present on the Observable object e.g. through an explicit import:

```ts
import 'rxjs/add/operator/throttleTime';
```

To get finer-grained control and the possibility to add multiple observable operators use the observe Directive.


### *observe Directive*: Fire events on an observable subject

Import the `ObserveEventDirectiveModule` into your application to use this directive.

Observe a single event:

```html
<button [ev-observe]="subject" ev-events="click">...</button>
```

Observe multiple events:

```html
<button [ev-observe]="subject" [ev-events]="['mousedown', 'mouseup']">...</button>
```

```ts
export class ExampleComponent implements OnInit {
    
    public subject = new Subject();
    
    constructor(private zone: NgZone) {}
    
    ngOnInit() {
     this.subject
         .throttleTime(300)
         .filter(someCondition)
         // ...
         .subscribe($event => this.zone.run(() => this.handleEvent($event)));
    }
    
    private handleEvent($event: any) {
        // ...
    }
}
```

Notes: The [ev-events] property can be either a string for a single event or an array of strings to handle multiple events.
