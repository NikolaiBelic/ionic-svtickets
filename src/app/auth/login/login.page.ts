import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRouterLink, IonRow, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { UserLogin } from '../interfaces/user';
import { MyGeolocation } from 'src/app/shared/classes/my-geolocation';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class LoginPage {
  user: UserLogin = {
    email: '',
    password: '',
    lat: 0,
    lng: 0
  };

  #authService = inject(AuthService);
  #alertCtrl = inject(AlertController);
  #changeDetector = inject(ChangeDetectorRef);
  #navCtrl = inject(NavController);

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

  login() {
    this.#authService
      .login(this.user)
      .subscribe({
        next: () => this.#navCtrl.navigateRoot(['/events']),
        error: async (error) => {
          (
            await this.#alertCtrl.create({
              header: 'Login error',
              message: 'Incorrect email and/or password',
              buttons: ['Ok'],
            })
          ).present();
        },
      });

      console.log(this.user);
  }
}
