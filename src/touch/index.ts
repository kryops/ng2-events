import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {TouchEventPlugin} from "./touch.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: TouchEventPlugin,
            multi: true
        }
    ]
})
export class TouchEventModule {}

export default TouchEventModule
