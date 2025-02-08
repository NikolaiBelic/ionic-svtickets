import { Component, OnInit, inject, ChangeDetectorRef, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonIcon, IonLabel, IonButton, IonImg, IonGrid, IonRow, IonCol, IonInput, NavController } from '@ionic/angular/standalone';
import { MyEventInsert } from '../interfaces/MyEvent';
import { Coordinates } from 'src/app/shared/interfaces/coordinates';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventsService } from '../services/events.service';
import { RouterLink } from '@angular/router';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator';
import { Geolocation } from '@capacitor/geolocation';
import { SearchResult } from 'src/app/shared/interfaces/search-result';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/directives/ol-maps/ga-autocomplete.directive';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  standalone: true,
  imports: [OlMapDirective, OlMarkerDirective, GaAutocompleteDirective, RouterLink, IonInput, IonCol, IonRow, IonGrid, IonImg, IonButton, IonLabel, IonIcon, IonList, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventFormPage implements OnInit {
  event: MyEventInsert = {
    title: '',
    description: '',
    price: 0,
    lat: 0,
    lng: 0,
    address: '',
    image: '',
    date: ''
    };

    #eventsService = inject(EventsService);
    coords = signal<[number, number]>([-0.5, 38.5]);
    address = signal<string>('');
    #changeDetector = inject(ChangeDetectorRef);
    #destroyRef = inject(DestroyRef);
    #navCtrl = inject(NavController);
    #alertCtrl = inject(AlertController);
    #saved = false;
    geolocationError: string | null = null;


    validInputId = false;

  constructor() {
    this.requestGeolocationPermission();
   }

  ngOnInit() {
  }

  async requestGeolocationPermission() {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'granted') {
        this.getPosition();
      } else {
        this.geolocationError = 'Geolocation permission denied';
      }
    } catch (error) {
      this.geolocationError = 'Error requesting geolocation permission';
    }
  }


  addEvent() {
        this.#eventsService
          .insertEvent(this.event)
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe({
            next: () => this.#navCtrl.navigateRoot(['/events']),
            error: async (error) => {
              (
                await this.#alertCtrl.create({
                  header: 'Event error',
                  message: 'Error adding event',
                  buttons: ['Ok'],
                })
              ).present();
            },
          });
    }

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.event.image = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.event.image = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async getPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.coords.set([coordinates.coords.longitude, coordinates.coords.latitude])
  }

  changePlace(result: SearchResult) {
    this.coords.set(result.coordinates);
    this.event.address = result.address;
  }
}
