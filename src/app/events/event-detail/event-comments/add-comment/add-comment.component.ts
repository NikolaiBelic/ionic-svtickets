import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ModalController, IonButton, IonContent, IonHeader, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventsService } from 'src/app/events/services/events.service';
import { EventDetailPage } from '../../event-detail.page';
import { EventCommentsPage } from '../event-comments.page';

@Component({
  selector: 'add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss'],
  imports: [FormsModule, IonButton, IonContent, IonHeader, IonLabel, IonList, IonListHeader, IonTitle, IonToolbar, IonButtons, IonIcon, IonTextarea]
})
export class AddCommentComponent {
  eventId!: number;
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  comment = '';

  #modalCtrl = inject(ModalController);

  postComment() {
    this.#eventsService.postComment(this.eventId, this.comment).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: () => {
        this.#modalCtrl.dismiss({ added: true });
      },
      error: (err) => {
        console.error(err, 'You can\'t comment if you are no attending to the event');
      }
    });
  }

  close() {
    this.#modalCtrl.dismiss();
  }
}
