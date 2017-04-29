import {NgModule} from "@angular/core";
import {ConditionEventDirective} from "./condition-event.directive";

@NgModule({
    declarations: [
        ConditionEventDirective
    ],
    exports: [
        ConditionEventDirective
    ]
})
export class ConditionEventDirectiveModule {}

export default ConditionEventDirectiveModule
