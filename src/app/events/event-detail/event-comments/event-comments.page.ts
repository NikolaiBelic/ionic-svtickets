import { Component, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonCardHeader, IonCard, IonList, IonItem, IonAvatar, IonImg, IonLabel, IonCardTitle, IonButton } from '@ionic/angular/standalone';
import { Comment } from '../../interfaces/MyEvent';
import { User } from 'src/app/profile/interfaces/user';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AddCommentComponent } from './add-comment/add-comment.component';


@Component({
  selector: 'event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [IonButton, RouterLink, IonCardTitle, IonLabel, IonImg, IonAvatar, IonItem, IonList, IonCard, IonCardHeader, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
  providers: [EventCommentsPage]
})
export class EventCommentsPage implements OnInit {
  event = inject(EventDetailPage).event;
  comments = signal<Comment[]>([]);
  users = signal<User[]>([]);

  #eventsService = inject(EventsService);
  #modalCtrl = inject(ModalController);

  #destroyRef = inject(DestroyRef);
  constructor() { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.#eventsService.getComments(this.event()!.id).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: (response) => {
        this.comments.set(response.comments);
      },
      error: (err) => {
        console.error('Error loading comments:', err);
      }
    });
  }

  async openModal() {
    const modal = await this.#modalCtrl.create({
      component: AddCommentComponent,
      componentProps: { eventId: this.event()!.id }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data && result.data.added) {
      this.loadComments();
    }
  }
}
