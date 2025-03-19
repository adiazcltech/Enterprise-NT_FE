import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CubeComponent } from './widgets/cube/cube.component';
import { AppRoutingModule } from './app-routing.module';
import { ResolutionComponent } from './components/resolution/resolution.component';
import { FacturationComponent } from './components/facturation/facturation.component';
import { FilterAreatestComponent } from './widgets/filter-areatest/filter-areatest.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterDemographicComponent } from './widgets/filter-demographic/filter-demographic.component';
import { DragulaModule } from 'ng2-dragula';
import { FacturacionOndemandComponent } from './components/facturacionondemand/facturacionondemand.component';
import { TableondemandComponent } from './components/tableondemand/tableondemand.component';
import { TamizajeComponent } from './components/tamizaje/tamizaje.component';


@NgModule({
  declarations: [
    AppComponent,
    CubeComponent,
    ResolutionComponent,
    FacturationComponent,
    FilterAreatestComponent,
    FilterDemographicComponent,
    FacturacionOndemandComponent,
    TableondemandComponent,
    TamizajeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgSelectModule,
    DragulaModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
