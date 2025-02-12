import { Component, OnInit, inject, signal, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonItem, IonAvatar, IonList, IonIcon } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from 'src/app/profile/interfaces/user';
import { EventCommunicationService } from '../../services/event-communication.service';

@Component({
  selector: 'event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [IonIcon, IonList, IonAvatar, IonItem, IonLabel, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventAttendPage implements OnInit {
  event = inject(EventDetailPage).event;

  #eventsService = inject(EventsService);
  #eventCommunicationService = inject(EventCommunicationService);

  attend = signal<boolean>(false);
  #destroyRef = inject(DestroyRef);

  numAttend = signal<number>(0);
  users = signal<User[]>([]);

  constructor() {
    this.attend.set(this.event()!.attend);
    this.numAttend.set(this.event()!.numAttend);
    this.loadUsers();

    this.#eventCommunicationService.attendChanged$
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.loadUsers();
      });
  }

  ngOnInit() {
  }

  postAttend() {
    this.#eventsService.postAttend(this.event()!.id).subscribe(() => {
      this.attend.set(true);
      this.numAttend.update(num => num + 1);
      this.loadUsers();
      this.#eventCommunicationService.emitAttendChanged();
    });
  }

  deleteAttend() {
    this.#eventsService.deleteAttend(this.event()!.id).subscribe(() => {
      this.attend.set(false);
      this.numAttend.update(num => num - 1);
      this.loadUsers();
      this.#eventCommunicationService.emitAttendChanged();
    });
  }

  loadUsers() {
    this.#eventsService.getAttendees(this.event()!.id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((resp) => {
      this.users.set(resp.users);
    });
  }
}
