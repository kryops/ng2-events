# Changelog

## Unreleased

*   **[BREAKING]** Change compilation to partial-Ivy
*   Update to Angular 12
*   Remove deprecated `EventManager.addGlobalEventListener` calls

For applications using Angular Ivy, but without the Angular CLI, follow the [docs on consuming partial Ivy code](https://angular.io/guide/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

## v4.2.2 (2020-03-06)

*   Make compatible with Angular 9


## v4.2.1 (2019-10-15)

*   Prevent `up`/`down` events from firing twice on iOS 13 and Chrome Android (#5)


## v4.2.0 (2018-05-05)

*   RxJS 6 compatibility


## v4.1.0 (2018-01-02)

*   Add `move` touch event (@saitho in #2)


## v4.0.0 (2017-11-04)

*   Angular 5 compatibility


## v3.1.0 (2017-04-29) [Angular 4]

This release adds flat ESM bundles in ES5 and ES2015 to the library

**package.json main fields:**

*   `main`: CommonJS library index (ES5)
*   `jsnext:main`: Flat ESM bundle (ES5)
*   `module`: Flat ESM bundle (ES5)
*   `es2015`: Flat ESM bundle (ES2015)


## v3.0.0 (2017-03-26)

*   Angular 4 compatibility


## v2.0.0 (2017-01-05) [Angular 2]

*   Added `once` event util
*   Added `scroll-in` / `scroll-out` events
*   Added condition directive to conditionally attach event handlers
*   Restructuring to eliminate dead code when only some sub-modules are used
*   Minor fixes

### BREAKING

The import path for sub-modules has changed.

Before:

``` ts
import {OutsideEventModule} from "ng2-events";
```

Now:

``` ts
import {OutsideEventModule} from "ng2-events/lib/outside";
```
