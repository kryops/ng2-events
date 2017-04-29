import {NgModule} from "@angular/core";
import {ObserveEventDirective} from "./observe-event.directive";

@NgModule({
    declarations: [
        ObserveEventDirective
    ],
    exports: [
        ObserveEventDirective
    ]
})
export class ObserveEventDirectiveModule {}

export default ObserveEventDirectiveModule
