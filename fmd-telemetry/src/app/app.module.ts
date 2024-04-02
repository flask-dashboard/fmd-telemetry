import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { StatsComponent } from './pages/stats/stats.component';
import { TopnavComponent } from './topnav/topnav.component';
import { DataComponent } from './pages/data/data.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { UserSessionComponent } from './pages/stats/user-session/user-session.component';
import { EndpointsComponent } from './pages/stats/endpoints/endpoints.component';
import { DatabasePruningComponent } from './pages/stats/database-pruning/database-pruning.component';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    TopnavComponent,
    DataComponent,
    StatsComponent,
    UserSessionComponent,
    EndpointsComponent,
    DatabasePruningComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ScrollingModule,
    MatTableModule,
    MatSortModule,
    BrowserAnimationsModule,
    MatTabsModule,
    HttpClientModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
