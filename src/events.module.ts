import {NgModule} from "@angular/core";
import {OutsideEventModule} from "./outside";
import {UndetectedEventModule} from "./undetected";
import {MultiEventModule} from "./multi";
import {ObserveEventModule} from "./observe";
import {ObserveEventDirectiveModule} from "./observe-directive";
import {TouchEventModule} from "./touch";
import {OnceEventModule} from "./once";
import {ConditionEventDirectiveModule} from "./condition-directive";
import {ScrollEventModule} from "./scroll";

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
