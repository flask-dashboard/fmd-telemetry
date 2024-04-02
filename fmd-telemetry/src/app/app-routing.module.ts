import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataComponent } from './pages/data/data.component';
import { StatsComponent } from './pages/stats/stats.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { DatabasePruningComponent } from './pages/stats/database-pruning/database-pruning.component';
import { EndpointsComponent } from './pages/stats/endpoints/endpoints.component';
import { UserSessionComponent } from './pages/stats/user-session/user-session.component';

export const routes: Routes = [
  { path: 'data', component: DataComponent },
  // { path: 'stats', component: StatsComponent },
  { path: 'stats/user-session', component: UserSessionComponent },
  { path: 'stats/endpoints', component: EndpointsComponent },
  { path: 'stats/database-pruning', component: DatabasePruningComponent },
  { path: '', redirectTo: '/stats/user-session', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}]
})
export class AppRoutingModule { }
