import { Component, OnInit, input, inject, computed, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { EventCardComponent } from '../event-card/event-card.component';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonIcon, IonLabel, IonTabButton, IonTabs, IonTabBar, EventCardComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventDetailPage {
  #productsService = inject(EventsService);

  id = input.required({ transform: numberAttribute });
  eventResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#productsService.getEvent(id)
  });
  event = computed(() => this.eventResource.value());
}

