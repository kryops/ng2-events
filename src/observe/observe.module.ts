import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {ObserveEventPlugin} from "./observe.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ObserveEventPlugin,
            multi: true
        }
    ]
})
export class ObserveEventModule {}
