import { Component, OnInit, input, output, EventEmitter, inject, signal, DestroyRef, effect } from '@angular/core';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IonCol, IonCard, IonImg, IonCardContent, IonCardTitle, IonRouterLink, IonButton, IonIcon, IonRow, IonAvatar, IonLabel } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';
import { EventCommunicationService } from '../services/event-communication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [IonLabel, IonCol, IonCard, IonImg, IonCardContent, IonCardTitle, IonRouterLink, IonButton, IonIcon, IonRow, IonAvatar, RouterLink, DatePipe, IntlCurrencyPipe]
})
export class EventCardComponent implements OnInit {
  event = input.required<MyEvent>();
  deleted = output<void>();
  attend = signal<boolean>(false);
  numAttend = signal<number>(0);

  #eventsService = inject(EventsService);
  #eventCommunicationService = inject(EventCommunicationService);
  #destroyRef = inject(DestroyRef);

  constructor() { 
  }

  ngOnInit() {
    this.attend.set(this.event().attend);
    this.numAttend.set(this.event().numAttend);

    this.#eventCommunicationService.attendChanged$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.attend.set(!this.attend());
        this.numAttend.update(num => num + (this.attend() ? 1 : -1));
      });
  }

  deleteEvent() {
    this.#eventsService.deleteEvent(this.event().id).subscribe(() => {
      this.deleted.emit();
    });
  }

  postAttend() {
    this.#eventsService.postAttend(this.event().id).subscribe(() => {
      this.attend.set(true);
      this.numAttend.update(num => num + 1);
    });
  }

  deleteAttend() {
    this.#eventsService.deleteAttend(this.event().id).subscribe(() => {
      this.attend.set(false);
      this.numAttend.update(num => num - 1);
    });
  }
}