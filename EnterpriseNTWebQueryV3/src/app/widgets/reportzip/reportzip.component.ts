import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { InterceptorService } from 'src/app/services/interceptor/interceptor.service';
import { LoaderService } from 'src/app/services/loader/loader.service';
import { ReportzipService } from 'src/app/services/reportzip/reportzip.service';
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-reportzip',
  templateUrl: './reportzip.component.html',
  styleUrls: ['./reportzip.component.css']
})
export class ReportzipComponent {

  private readonly notifier: NotifierService;
  subscription: Subscription;
  keyStimulsoft: string;

  constructor(
    private reportZipDS: ReportzipService,
    private interceptorDS: InterceptorService,
    private notifierService: NotifierService,
    private loaderDS: LoaderService,
    private translate: TranslateService
    ) {
    this.loaderDS.loading(false);
    this.notifier = notifierService;
    this.keyStimulsoft = environment.keyStimulsoft;
  }

  ngOnInit() {
    this.subscription = this.reportZipDS.open$.subscribe((data:any) => {
      if(data !== null && data !== undefined) {
        this.init(data);
      }
    });
  }

  init(data:any) {

  }

}
