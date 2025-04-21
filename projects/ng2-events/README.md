# ng2-events

**This version is compatible with Angular 18+**

- For Angular 13-17, use version 5.0.0
- For Angular 9-12 apps using View Engine, use version 4.2.2
- For Angular 5-8, use version 4.2.2
- For Angular 4, use version 3.1.0
- For Angular 2, use version 2.0.0

Extensions to the Angular event handling to make use of additional events and allow for better control over change detection for high-performance applications:

- Listen to events outside of the current element
- Up/down event handlers for cross-browser touch/mouse events
- Scroll-in/out event handlers to control behavior of elements within or outside the viewport
- Listen to multiple events with a single handler
- Unregister an event listener after the event fires once
- Attach event listeners only when a condition is met
- Listen to events without triggering change detection
- Use Observables to fine-tune when to trigger change detection

**Examples**:

```html
<div (outside.click)="close()">...</div>

<button (down)="activate()" (up)="deactivate()" (move)="active()">...</button>

<div (scroll-in)="activate()" (scroll-out)="deactivate()">...</div>

<input (multi.focus,select)="foo($event)" />

<button (once.click)="foo()">...</button>

<button [ev-condition]="cond" ev-events="click" (ev-fire)="foo()">...</button>

<button (undetected.click)="handleUndetectedClick()">...</button>

<button [ev-observe]="subject" [ev-events]="['mousedown', 'mouseup']">...</button>
```

## Installation

```
npm install --save ng2-events
```

For applications using Angular Ivy, but without the Angular CLI, follow the [docs on consuming partial Ivy code](https://angular.dev/tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

## Usage

To use the events, provide them in your application config:

```ts
import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { EVENT_MANAGER_PLUGINS } from "@angular/platform-browser";
import { MultiEventPlugin, OnceEventPlugin, OutsideEventPlugin, SCROLL_EVENT_TIME, ScrollEventPlugin, TouchEventPlugin, UndetectedEventPlugin } from "ng2-events";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: MultiEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OnceEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OutsideEventPlugin,
      multi: true,
    },
    { provide: SCROLL_EVENT_TIME, useValue: 500 },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ScrollEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: TouchEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: UndetectedEventPlugin,
      multi: true,
    },
  ],
};
```

## Additional Events

### _outside_: Listen to events outside of an element

```ts
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: OutsideEventPlugin,
  multi: true,
}
```

```html
<div (outside.click)="close()">...</div>
```

The event handler is called when an event is fired outside of the element and its children.

### _up/down/move_: Cross-browser quick mouse/touch events

```ts
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: TouchEventPlugin,
  multi: true,
}
```

```html
<button (down)="activate()" (up)="deactivate()" (move)="active()">...</button>
```

The up/down events are fired when one of the following events is fired on the element:

- mousedown/mouseup
- pointerdown/pointerup
- touchstart/touchend

The move event is fired when one of the following events is fired on the element:

- mousemove
- pointermove
- touchmove

Note that `preventDefault()` is called on the first event to occur to make sure that the event handler is only fired once. This prevents touch-enabled devices from firing the handler for both the `touchstart` and the `mousedown` event. Be aware that especially with the `move` event this might interfere with scrolling on touch-based devices!

### _scroll-in / scroll-out_: Detect when an element is entering or leaving the viewport

```ts
{ provide: SCROLL_EVENT_TIME, useValue: 500 },
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: ScrollEventPlugin,
  multi: true,
}
```

```html
<div (scroll-in)="activate()" (scroll-out)="deactivate()">...</div>
```

This event handler reacts to the window's `scroll`, `resize`, and `orientationchange` events. It only checks the vertical scrolling within the window.

The configuration value `SCROLL_EVENT_TIME` sets a minimum time distance between checks to keep the performance impact low. The default value is 200ms.

Upon initialization the event handler is called directly if the element has the matching status (`scroll-in` is called if the element is visible in the viewport at rendering time, `scroll-out` is called otherwise). `$event` is `true` for the initial call, `false` for all subsequent calls.

## Event Helpers

### _multi_: Listen to multiple events at once

```ts
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: MultiEventPlugin,
  multi: true,
}
```

```html
<input (multi.focus,select)="foo($event)" />
```

### _once_: Only fire event listener once

```ts
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: OnceEventPlugin,
  multi: true,
}
```

```html
<button (once.click)="foo()">...</button>
```

The event listener is unregistered when the event is first fired. Note that it is reattached every time the element is newly rendered, especially inside `*ngIf` and `*ngFor` blocks when conditions or references change.

### _condition Directive_: Only attach event listeners when a condition is met

Import the `ConditionEventDirective` to use this directive.

Listen to a single event:

```html
<button [ev-condition]="isActive()" ev-events="click" (ev-fire)="handleClick($event)">...</button>
```

Listen to multiple events:

```html
<button [ev-condition]="isActive()" [ev-events]="['mousedown', 'mouseup']" (ev-fire)="handleEvent($event)">...</button>
```

This directive also allows for listening to a dynamic set of events:

```html
<button [ev-condition]="true" [ev-events]="events" (ev-fire)="handleEvent($event)">...</button>
```

```ts
export class ExampleComponent {
  events = ["mousedown"];

  changeEvents() {
    this.events = ["mouseup"];
  }
}
```

**Note**: If you just change events within the array, you have to manually change its reference so the change detector picks the change up and resets the event listeners:

```ts
this.events.push("click");
this.events = this.events.slice();
```

## Change Detection

**Note**: The following event helpers will work for primitive events (such as 'click', 'mousemove', ...). More complex event plugins such as the HammerJS touch gesture integration take control over their own change detection handling.

### _undetected_: Listen to events without triggering change detection

```ts
{
  provide: EVENT_MANAGER_PLUGINS,
  useClass: UndetectedEventPlugin,
  multi: true,
}
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

### _observe Directive_: Fire events on an observable subject

Import the `ObserveEventDirective` to use this directive.

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
      .subscribe(($event) => this.zone.run(() => this.handleEvent($event)));
  }

  private handleEvent($event: any) {
    // ...
  }
}
```
