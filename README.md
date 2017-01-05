Extensions to the Angular2 event handling to make use of additional events and allow for better control over change detection for high-performance applications:

*   Listen to events outside of the current element
*   Up/down event handlers for cross-browser touch/mouse events
*   Listen to multiple events with a single handler
*   Unregister an event listener after the event fires once
*   Attach event listeners only when a condition is met
*   Listen to events without triggering change detection
*   Use Observables to fine-tune when to trigger change detection

**Examples**:

```html
<div (outside.click)="close()">...</div>

<button (down)="activate()" (up)="deactivate()">...</button>

<input (multi.focus,select)="foo($event)" />

<button (once.click)="foo()">...</button>

<button [ev-condition]="cond" ev-events="click" (ev-fire)="foo()">...</button>

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
    imports: [Ng2EventsModule],
    exports: [Ng2EventsModule]
})
export class SharedModule {}
```

The recommended way is to only import the sub-modules for the features you need.


## Additional Events

### *outside*: Listen to events outside of an element

```ts
import {NgModule} from "@angular/core";
import {OutsideEventModule} from "ng2-events/lib/outside";

@NgModule({
    imports: [OutsideEventModule],
    exports: [OutsideEventModule]
})
export class SharedModule {}
```

```html
<div (outside.click)="close()">...</div>
```

The event handler is called when an event is fired outside of the element and its children.


### *up/down*: Cross-browser quick mouse/touch events

```ts
import {NgModule} from "@angular/core";
import {TouchEventModule} from "ng2-events/lib/touch";

@NgModule({
    imports: [TouchEventModule],
    exports: [TouchEventModule]
})
export class SharedModule {}
```

```html
<button (down)="activate()" (up)="deactivate()">...</button>
```

The up/down events are fired when one of the following events is fired on the element:

*   mousedown/mouseup
*   pointerdown/pointerup
*   touchstart/touchend

Note that `preventDefault()` is called on the first event to occur to make sure that the event handler is only fired once. This prevents touch-enabled devices from firing the handler for both the `touchstart` and the `mousedown` event.

For more complex touch gestures use the HammerJS integration.


## Event Helpers

### *multi*: Listen to multiple events at once

```ts
import {NgModule} from "@angular/core";
import {MultiEventModule} from "ng2-events/lib/multi";

@NgModule({
    imports: [MultiEventModule],
    exports: [MultiEventModule]
})
export class SharedModule {}
```

```html
<input (multi.focus,select)="foo($event)" />
```

### *once*: Only fire event listener once

```ts
import {NgModule} from "@angular/core";
import {OnceEventModule} from "ng2-events/lib/once";

@NgModule({
    imports: [OnceEventModule],
    exports: [OnceEventModule]
})
export class SharedModule {}
```

```html
<button (once.click)="foo()">...</button>
```

The event listener is unregistered when the event is first fired. Note that it is reattached every time the element is newly rendered, especially inside `*ngIf` and `*ngFor` blocks when conditions or references change.


### *condition Directive*: Only attach event listeners when a condition is met

```ts
import {NgModule} from "@angular/core";
import {ConditionEventDirectiveModule} from "ng2-events/lib/condition-directive";

@NgModule({
    imports: [ConditionEventDirectiveModule],
    exports: [ConditionEventDirectiveModule]
})
export class SharedModule {}
```

Listen to a single event:

```html
<button [ev-condition]="isActive()"
    ev-events="click"
    (ev-fire)="handleClick($event)">...</button>
```

Listen to multiple events:

```html
<button [ev-condition]="isActive()"
    [ev-events]="['mousedown', 'mouseup']"
    (ev-fire)="handleEvent($event)">...</button>
```

This directive also allows for listening to a dynamic set of events:

```html
<button [ev-condition]="true"
    [ev-events]="events"
    (ev-fire)="handleEvent($event)">...</button>
```

```ts
export class ExampleComponent {
    
    events = ['mousedown'];
    
    changeEvents() {
        this.events = ['mouseup'];
    }
    
}
```

**Note**: If you just change events within the array, you have to manually change its reference so the change detector picks the change up and resets the event listeners:

```ts
this.events.push('click');
this.events = this.events.slice();
```


## Change Detection

**Note**: The following event helpers will work for primitive events (such as 'click', 'mousemove', ...). More complex event plugins such as the HammerJS touch gesture integration take control over their own change detection handling.

### *undetected*: Listen to events without triggering change detection

```ts
import {NgModule} from "@angular/core";
import {UndetectedEventModule} from "ng2-events/lib/undetected";

@NgModule({
    imports: [UndetectedEventModule],
    exports: [UndetectedEventModule]
})
export class SharedModule {}
```

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

```ts
import {NgModule} from "@angular/core";
import {ObserveEventModule} from "ng2-events/lib/observe";

@NgModule({
    imports: [ObserveEventModule],
    exports: [ObserveEventModule]
})
export class SharedModule {}
```

```html
<button (observe.throttleTime-500.click)="handleClick()">...</button>
```

The method used must be present on the Observable object e.g. through an explicit import:

```ts
import 'rxjs/add/operator/throttleTime';
```

To get finer-grained control and the possibility to add multiple observable operators use the observe Directive.


### *observe Directive*: Fire events on an observable subject

```ts
import {NgModule} from "@angular/core";
import {ObserveEventDirectiveModule} from "ng2-events/lib/observe-directive";

@NgModule({
    imports: [ObserveEventDirectiveModule],
    exports: [ObserveEventDirectiveModule]
})
export class SharedModule {}
```

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
