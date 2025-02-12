import { Component, OnInit, input, signal, effect, inject, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, ModalController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { User } from '../interfaces/user';
import { OlMapDirective } from '../../shared/directives/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/directives/ol-maps/ol-marker.directive';
import { PasswordFormComponent } from '../profile/password-form/password-form.component';
import { ProfileFormComponent } from '../profile/profile-form/profile-form.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ProfileService } from '../services/profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, OlMapDirective, OlMarkerDirective, IonItem, IonAvatar, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage {
  user = input.required<User>();
  coords = signal<[number, number]>([-0.5, 38.5]);

  #profileService = inject(ProfileService);
  #modalCtrl = inject(ModalController);
  #cdr = inject(ChangeDetectorRef);
  #alertCtrl = inject(AlertController);
  #destroyRef = inject(DestroyRef);

  image = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.coords.set([this.user().lng, this.user().lat]);
      this.image.set(this.user().avatar);
    });

  }

  async openModalPassword() {
    const modal = await this.#modalCtrl.create({
      component: PasswordFormComponent
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data && result.data.added) {

    }
  }

  async openModalProfile() {
    const modal = await this.#modalCtrl.create({
      component: ProfileFormComponent,
      componentProps: {
        name: this.user().name,
        email: this.user().email
      }
    });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.data && result.data.added) {
      this.user().name = result.data.name;
      this.user().email = result.data.email;
      this.#cdr.detectChanges();
    }
  }

  async takePhoto() {
    ;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.image.set(photo.dataUrl as string);
    this.#cdr.markForCheck();
    this.saveAvatar();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.image.set(photo.dataUrl as string);
    this.#cdr.markForCheck();
    this.saveAvatar();
  }

  saveAvatar() {
        this.#profileService.saveAvatar(this.image()!).pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: async () => {
            this.#modalCtrl.dismiss({ added: true });
            (
              await this.#alertCtrl.create({
                header: 'Avatar saved',
                message: 'Your avatar has been saved',
                buttons: ['Ok'],
              })
            ).present();
          },
          error: (err) => {
            console.error(err, 'Error saving avatar');
          }
        });
      }
}