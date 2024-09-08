import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, RouterModule} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {TokenInterceptor} from "./core/intercepters/token.interceptor";
import {ConfirmationService, MessageService} from "primeng/api";
import {StoreModule} from "@ngrx/store";
import {sidebarVisibleReducer} from "./store/sidebarVisible/sidebar-visible.reducer";
import {DialogService} from "primeng/dynamicdialog";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    // provideServerRendering(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      RouterModule.forRoot(routes),
      // HttpClientModule,
      StoreModule.forRoot({ sidebar: sidebarVisibleReducer }),
    ),

    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {provide: MessageService, useClass: MessageService},
    {provide: ConfirmationService, useClass: ConfirmationService},
    {provide: DialogService, useClass: DialogService},
  ]
}
