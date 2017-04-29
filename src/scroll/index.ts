import {NgModule} from "@angular/core";
import {EVENT_MANAGER_PLUGINS} from "@angular/platform-browser";
import {ScrollEventPlugin, SCROLL_EVENT_TIME} from "./scroll.event";

@NgModule({
    providers: [
        {
            provide: EVENT_MANAGER_PLUGINS,
            useClass: ScrollEventPlugin,
            multi: true
        },
        {
            provide: SCROLL_EVENT_TIME,
            useValue: 200
        }
    ]
})
export class ScrollEventModule {}

export {SCROLL_EVENT_TIME} from './scroll.event';

export default ScrollEventModule
