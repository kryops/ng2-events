import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {OutsideEventPlugin} from "./outside.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: OutsideEventPlugin,
            multi: true
        }
    ]
})
export class OutsideEventModule {}

export default OutsideEventModule
