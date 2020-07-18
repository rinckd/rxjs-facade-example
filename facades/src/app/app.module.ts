import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material-module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { GoogleMapsFacade } from './google-maps.facade';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    MaterialModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
  ],
  providers: [GoogleMapsFacade],
  bootstrap: [AppComponent],
})
export class AppModule {}
