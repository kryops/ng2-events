import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {OnceEventPlugin} from "./once.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: OnceEventPlugin,
            multi: true
        }
    ]
})
export class OnceEventModule {}
