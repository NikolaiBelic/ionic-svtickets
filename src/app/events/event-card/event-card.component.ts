import { Component, OnInit, input, output, inject, signal } from '@angular/core';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IonCol, IonCard, IonImg, IonCardContent, IonCardTitle, IonRouterLink, IonButton, IonIcon, IonRow, IonAvatar } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { IntlCurrencyPipe } from '../../shared/pipes/intl-currency.pipe';



@Component({
  selector: 'event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  imports: [IonCol, IonCard, IonImg, IonCardContent, IonCardTitle, IonRouterLink, IonButton, IonIcon, IonRow, IonAvatar, RouterLink, DatePipe, IntlCurrencyPipe]
})
export class EventCardComponent implements OnInit {
  event = input.required<MyEvent>();
  deleted = output<void>();
  attend = signal<boolean>(false);
  numAttend = signal<number>(0);
  attendChanged = output<void>();

  #eventsService = inject(EventsService);

  constructor() { }

  ngOnInit() {
    this.attend.set(this.event().attend);
    this.numAttend.set(this.event().numAttend);
  }


  deleteEvent() {
    this.#eventsService.deleteEvent(this.event().id).subscribe(() => {
      this.deleted.emit();
    });
  }

  postAttend() {
    this.#eventsService.postAttend(this.event().id!).subscribe(() => {
      this.attend.set(!this.attend());
      this.numAttend.update(num => num + (this.attend() ? 1 : -1));
      this.attendChanged.emit();
    });
  }

  deleteAttend() {
    this.#eventsService.deleteAttend(this.event().id!).subscribe(() => {
      this.attend.set(!this.attend());
      this.numAttend.update(num => num + (this.attend() ? 1 : -1));
      this.attendChanged.emit();
    });
  }

}
