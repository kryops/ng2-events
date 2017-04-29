import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {UndetectedEventPlugin} from "./undetected.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: UndetectedEventPlugin,
            multi: true
        }
    ]
})
export class UndetectedEventModule {}

export default UndetectedEventModule
