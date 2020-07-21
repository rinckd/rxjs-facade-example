import { OnDestroy, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Subject, Observable, combineLatest, of } from 'rxjs';
import { map, distinctUntilChanged, take } from 'rxjs/operators';

export interface GoogleMapsState {
  loadingAddress: boolean;
  mapZoom: number;
  mapOptions: google.maps.MapOptions;
  markers: any[];
  location: string;
}

let _state: GoogleMapsState = {
  loadingAddress: true,
  mapZoom: 15,
  markers: [],
  location: '',
  mapOptions: {
    zoom: 16,
    center: new google.maps.LatLng(36.637195, -121.934178),
  },
};

@Injectable()
export class GoogleMapsFacade implements OnDestroy {
  private onDestroy = new Subject<void>();
  private store = new BehaviorSubject<GoogleMapsState>(_state);
  private state$ = this.store.asObservable();
  private geocoder = new google.maps.Geocoder();

  location$ = this.state$.pipe(
    map((state) => {
      return state.location;
    }),
    distinctUntilChanged()
  );

  mapOptions$ = this.state$.pipe(
    map((state) => {
      return state.mapOptions;
    }),
    distinctUntilChanged()
  );

  mapZoom$ = this.state$.pipe(
    map((state) => {
      return state.mapZoom;
    }),
    distinctUntilChanged()
  );

  loadingAddress$ = this.state$.pipe(
    map((state) => {
      return state.loadingAddress;
    }),
    distinctUntilChanged()
  );

  markers$ = this.state$.pipe(
    map((state) => {
      return state.markers;
    }),
    distinctUntilChanged()
  );

  vm$: Observable<GoogleMapsState> = combineLatest([
    this.loadingAddress$,
    this.location$,
    this.markers$,
    this.mapZoom$,
    this.mapOptions$,
  ]).pipe(
    map(([loadingAddress, location, markers, mapZoom, mapOptions]) => {
      return {
        loadingAddress,
        location,
        markers,
        mapZoom,
        mapOptions,
      };
    })
  );

  constructor(private ngZone: NgZone) {}

  geoCode(location: google.maps.LatLngLiteral, dropPin: boolean) {
    this.updateState({ ..._state, loadingAddress: true });
    setTimeout(() => {
      // the setTimeout is not necessary! Only here to slow things down
      // so that the progress bar interactions are easier to see
      this.geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK') {
          this.ngZone.run(() => {
            this.mapOptions$.pipe(take(1)).subscribe((options) => {
              this.updateState({
                ..._state,
                loadingAddress: false,
                location: results[0].formatted_address,
              });
              if (dropPin) {
                this.updatePlace(location);
              }
            });
          });
        } else {
          alert('not successful for the following reason: ' + status);
        }
      });
    }, 1000);
  }

  updatePlace(location: google.maps.LatLngLiteral) {
    const markers: any[] = [
      {
        position: location,
        options: {
          draggable: true,
          animation: google.maps.Animation.DROP,
        },
      },
    ];
    this.updateState({ ..._state, markers });
  }

  private updateState(state: GoogleMapsState) {
    this.store.next((_state = state));
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
