import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {

  @Input() loader: boolean;

  subscription: Subscription;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.subscription = this.loaderService.load$.subscribe(data => {
      this.loader = data;
    });
  }

}
