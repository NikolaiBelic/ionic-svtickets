import { Component, OnInit, input, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar } from '@ionic/angular/standalone';
import { User } from '../interfaces/user';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  userLoading = input.required<User>();
  coordinates = signal<[number, number]>([0, 0]);
  user = signal<User | null>(null);

  constructor() {
    effect(() => {
      this.user.set(this.userLoading());
    });
  }

  ngOnInit() {
    // Aquí puedes hacer otras inicializaciones si es necesario
  }
}