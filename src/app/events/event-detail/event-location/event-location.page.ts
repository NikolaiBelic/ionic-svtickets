import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonFabButton, IonFab, IonIcon } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { OlMapDirective } from 'src/app/shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/directives/ol-maps/ol-marker.directive';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator';

@Component({
  selector: 'event-location',
  templateUrl: './event-location.page.html',
  styleUrls: ['./event-location.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFab, IonFabButton, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, OlMapDirective, OlMarkerDirective]
})
export class EventLocationPage implements OnInit {
  event = inject(EventDetailPage).event;

  coords = signal<[number, number]>([-0.5, 38.5]);
  constructor() {
    this.coords.set([this.event()!.lng, this.event()!.lat]);
   }

  ngOnInit() {
  }

  startNavigation() {
    LaunchNavigator.navigate(this.coords().reverse());
  }
}
