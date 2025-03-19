import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './modules/account/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { LoaderComponent } from './modules/loader/loader.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { DashboardComponent } from './modules/configuration/dashboard/dashboard.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTabsModule} from '@angular/material/tabs';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ColorPickerModule } from 'ngx-color-picker';
import { ToggleComponent } from './widgets/toggle/toggle.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { QuillModule } from 'ngx-quill';
import { PreliminaryComponent } from './widgets/preliminary/preliminary.component';
import { ReportzipComponent } from './widgets/reportzip/reportzip.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ViewerComponent } from './modules/stimulsoft/viewer/viewer.component';
import { MatMenuModule } from '@angular/material/menu';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { CaptchaComponent } from './widgets/captcha/captcha.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
		horizontal: {
			position: 'right',
			distance: 12
		},
		vertical: {
			position: 'bottom',
			distance: 12,
			gap: 10
		}
	},
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    DashboardComponent,
    FilterPipe,
    ToggleComponent,
    PreliminaryComponent,
    ReportzipComponent,
    ViewerComponent,
    CaptchaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NotifierModule.withConfig(customNotifierOptions),
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'danger', // set defaults here
    }),
    NoopAnimationsModule,
    MatPasswordStrengthModule.forRoot(),
    CdkVirtualScrollViewport,
    ScrollingModule,
    MatDatepickerModule,
    MatTabsModule,
    MatMomentDateModule,
    ColorPickerModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    QuillModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    MatMenuModule,
    CdkAccordionModule,
    NgIdleKeepaliveModule.forRoot() 
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
