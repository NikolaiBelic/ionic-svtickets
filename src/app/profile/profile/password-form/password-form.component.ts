import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { AlertController, ModalController, IonButton, IonContent, IonHeader, IonList, IonItem, IonTitle, IonToolbar, IonButtons, IonIcon, IonInput } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive';
import { ProfileService } from '../../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
  imports: [IonButton, IonContent, IonHeader, IonList, IonItem, IonIcon, IonInput, IonTitle, IonToolbar, IonButtons, FormsModule, ValueEqualsDirective]
})
export class PasswordFormComponent implements OnInit {
  password = '';
  password2 = '';
  #profileService = inject(ProfileService);

  #modalCtrl = inject(ModalController);
  #destroyRef = inject(DestroyRef);
  #alertCtrl = inject(AlertController);

  constructor() { }

  ngOnInit() { }

  close() {
    this.#modalCtrl.dismiss();
  }

  savePassword() {
    this.#profileService.savePassword(this.password).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
      next: async () => {
        this.#modalCtrl.dismiss({ added: true });
        (
          await this.#alertCtrl.create({
            header: 'Password saved',
            message: 'Your password has been saved',
            buttons: ['Ok'],
          })
        ).present();
      },
      error: (err) => {
        console.error(err, 'Error saving password');
      }
    });
  }
}
