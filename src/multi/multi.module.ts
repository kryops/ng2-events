import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {MultiEventPlugin} from "./multi.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: MultiEventPlugin,
            multi: true
        }
    ]
})
export class MultiEventModule {}
