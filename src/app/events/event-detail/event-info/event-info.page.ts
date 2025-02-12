import { Component, OnInit, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventDetailPage } from '../event-detail.page';
import { EventsService } from '../../services/events.service';
import { AlertController, NavController, IonContent, IonHeader, IonTitle, IonToolbar, IonCardTitle, IonCard, IonCardContent, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonAvatar, IonItem } from '@ionic/angular/standalone';
import { EventCardComponent } from '../../event-card/event-card.component';

@Component({
  selector: 'event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, EventCardComponent]
})
export class EventInfoPage implements OnInit {
  event = inject(EventDetailPage).event;

  #alertCtrl = inject(AlertController);
  #eventsService = inject(EventsService);
  #nav = inject(NavController);
  deleted = output<void>();

  constructor() { }

  ngOnInit() {
  }

  async eventDeleted() {
    const alert = await this.#alertCtrl.create({
      header: 'Delete product',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.deleted.emit();
            this.#nav.navigateRoot(['/events']);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }
}

// belen.sorianoestevez@emeal.nttdata.com
