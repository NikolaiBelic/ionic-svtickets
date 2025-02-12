import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AlertController, ModalController, IonButton, IonContent, IonHeader, IonLabel, IonList, IonItem, IonTitle, IonToolbar, IonButtons, IonIcon, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonList, IonItem, IonIcon, IonInput, IonTitle, IonToolbar, IonButtons, FormsModule]
})
export class ProfileFormComponent implements OnInit {
  name = '';
  email = '';

  #profileService = inject(ProfileService);

  #modalCtrl = inject(ModalController);
  #destroyRef = inject(DestroyRef);
  #alertCtrl = inject(AlertController);

  constructor() { }

  ngOnInit() { }

  close() {
    this.#modalCtrl.dismiss();
  }

  saveProfile() {
    this.#profileService.saveProfile(this.name, this.email).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: async () => {
        this.#modalCtrl.dismiss({ added: true, name: this.name, email: this.email });
        (
          await this.#alertCtrl.create({
            header: 'Profile saved',
            message: 'Your profile has been saved',
            buttons: ['Ok'],
          })
        ).present();
      },
      error: (err) => {
        console.error(err, 'Error saving profile');
      }
    });
  }

}
