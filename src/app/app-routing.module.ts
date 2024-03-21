import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './pages/data/data.component';
import { StatsComponent } from './pages/stats/stats.component';

export const routes: Routes = [
  { path: 'data', component: DataComponent},
  { path: 'stats', component: StatsComponent},
  { path: '', redirectTo: '/stats', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
