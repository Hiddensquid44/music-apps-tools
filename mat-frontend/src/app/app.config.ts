import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { GlobalData } from './shared/global-data';
import { BlindtestData } from './features/blindtest/blindtest-data';
import { LoginData } from './core/login/login-data';

function initializeApp() {
  return () => {
    LoginData.loadLoginData();
    GlobalData.loadGlobalData();
    BlindtestData.loadBlindtestData();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true
    },
    provideAnimations(),
    providePrimeNG({
        theme: {
            preset: Aura,
          options: {
              darkModeSelector: false
          }
        }
    })
  ]
};
