import { Component, OnInit, NgZone } from '@angular/core';
import { GoogleMapsFacade, GoogleMapsState } from './google-maps.facade';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private googleMapsFacade: GoogleMapsFacade) {}

  vm$: Observable<GoogleMapsState> = this.googleMapsFacade.vm$;

  mapDragged(event: google.maps.MouseEvent) {
    this.googleMapsFacade.geoCode(
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      false
    );
  }

  ngOnInit() {
    this.googleMapsFacade.geoCode({ lat: 36.637195, lng: -121.934178 }, true);
  }
}
