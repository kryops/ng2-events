import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import {
  MultiEventPlugin,
  OnceEventPlugin,
  OutsideEventPlugin,
  SCROLL_EVENT_TIME,
  ScrollEventPlugin,
  TouchEventPlugin,
  UndetectedEventPlugin,
} from 'ng2-events';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: MultiEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OnceEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OutsideEventPlugin,
      multi: true,
    },
    { provide: SCROLL_EVENT_TIME, useValue: 500 },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ScrollEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: TouchEventPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: UndetectedEventPlugin,
      multi: true,
    },
  ],
};
