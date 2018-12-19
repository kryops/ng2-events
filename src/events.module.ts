import {NgModule} from "@angular/core";
import {OutsideEventModule} from "./outside/index";
import {UndetectedEventModule} from "./undetected/index";
import {MultiEventModule} from "./multi/index";
import {ObserveEventModule} from "./observe/index";
import {ObserveEventDirectiveModule} from "./observe-directive/index";
import {TouchEventModule} from "./touch/index";
import {OnceEventModule} from "./once/index";
import {ConditionEventDirectiveModule} from "./condition-directive/index";
import {ScrollEventModule} from "./scroll/index";

@NgModule({
    imports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule,
        OnceEventModule,
        ConditionEventDirectiveModule,
        ScrollEventModule
    ],
    exports: [
        OutsideEventModule,
        TouchEventModule,
        MultiEventModule,
        UndetectedEventModule,
        ObserveEventModule,
        ObserveEventDirectiveModule,
        OnceEventModule,
        ConditionEventDirectiveModule,
        ScrollEventModule
    ]
})
export class Ng2EventsModule {}
