import {NgModule} from "@angular/core";
import {OutsideEventModule} from "./outside/outside.module";
import {UndetectedEventModule} from "./undetected/undetected.module";
import {MultiEventModule} from "./multi/multi.module";
import {ObserveEventModule} from "./observe/observe.module";
import {ObserveEventDirectiveModule} from "./observe-directive/observe-directive.module";
import {ObserveEventDirective} from "./observe-directive/observe-event.directive";
import {TouchEventModule} from "./touch/touch.module";

@NgModule({
    imports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule
    ],
    exports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule
    ]
})
export class Ng2EventsModule {}
