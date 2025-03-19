import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CubeComponent } from './widgets/cube/cube.component';
import { ResolutionComponent } from './components/resolution/resolution.component';
import { FacturationComponent } from './components/facturation/facturation.component';
import { FacturacionOndemandComponent } from './components/facturacionondemand/facturacionondemand.component';
import { TamizajeComponent } from './components/tamizaje/tamizaje.component';

// Importa los componentes que deseas enrutar

const routes: Routes = [
  { path: 'cube/:id', component: CubeComponent },
  { path: 'resolution/:id', component: ResolutionComponent },
  { path: 'facturation', component: FacturationComponent },
  { path: 'facturation-on-demand', component: FacturacionOndemandComponent },
  { path: 'tamizaje', component: TamizajeComponent },
  { path: '', redirectTo: '/resolution', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
