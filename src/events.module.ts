import {NgModule} from "@angular/core";
import {OutsideEventModule} from "./outside/outside.module";
import {UndetectedEventModule} from "./undetected/undetected.module";
import {MultiEventModule} from "./multi/multi.module";
import {ObserveEventModule} from "./observe/observe.module";
import {ObserveEventDirectiveModule} from "./observe-directive/observe-directive.module";
import {TouchEventModule} from "./touch/touch.module";
import {OnceEventModule} from "./once/once.module";

@NgModule({
    imports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule,
        OnceEventModule
    ],
    exports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule,
        OnceEventModule
    ]
})
export class Ng2EventsModule {}
