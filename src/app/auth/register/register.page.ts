import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonRouterLink, ToastController, NavController, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel } from '@ionic/angular/standalone';
import { User } from '../interfaces/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive';
import { Coordinates } from 'src/app/shared/interfaces/coordinates';
import { MyGeolocation } from 'src/app/shared/classes/my-geolocation';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ FormsModule, RouterLink, IonRouterLink, ValueEqualsDirective, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonIcon, IonImg, IonButton, IonGrid, IonRow, IonCol, IonLabel],
})
export class RegisterPage {
  user: User = {
    name: '',
    password: '',
    email: '',
    avatar: '',
    lat: 0,
    lng: 0
  };
  password2 = '';

  coords: Coordinates = { latitude: 0, longitude: 0 };
  #authService = inject(AuthService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);

  async ngOnInit() {
    try {
      const pos = await MyGeolocation.getLocation();
      this.user.lat = pos.latitude;
      this.user.lng = pos.longitude;
      this.#changeDetector.detectChanges(); // Asegúrate de detectar los cambios
    } catch (error) {
      console.error(error, "Geolocalization is unavailable");
    }
  }

  register() {
    this.#authService.register(this.user).subscribe(
      async () => {
        (await this.#toastCtrl.create({
          duration: 3000,
          position: 'bottom',
          message: 'User registered!'
        })).present();
        this.#nav.navigateRoot(['/auth/login']);
      }
    );
  }

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 640,
      width: 640,
      allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }
}
