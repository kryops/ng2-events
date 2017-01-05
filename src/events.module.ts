import {NgModule} from "@angular/core";
import {OutsideEventModule} from "./outside";
import {UndetectedEventModule} from "./undetected";
import {MultiEventModule} from "./multi";
import {ObserveEventModule} from "./observe";
import {ObserveEventDirectiveModule} from "./observe-directive";
import {TouchEventModule} from "./touch";
import {OnceEventModule} from "./once";

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
