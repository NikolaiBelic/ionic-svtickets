import { Component, OnInit, signal, input, inject, DestroyRef, effect } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonInfiniteScrollContent, IonInfiniteScroll, IonSearchbar } from '@ionic/angular/standalone';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProfileService } from '../../profile/services/profile.service';
import { debounceTime, map } from 'rxjs/operators';
import { EventCardComponent } from '../event-card/event-card.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, EventCardComponent,
     ReactiveFormsModule]
})
export class HomePage implements OnInit {
  events = signal<MyEvent[]>([]);

  #eventsService = inject(EventsService);
  #profileService = inject(ProfileService);

  page = signal<number>(1);
  count = signal<number>(0);
  order = signal<string>('distance');
  searchEvents = new FormControl('');
  #destroyRef = inject(DestroyRef);

  creator = input<number>();
  attending = input<number>();
  name = signal<string>('');
  finished = false;

  search = toSignal(this.searchEvents.valueChanges, { initialValue: '' });

  /* previousValue: string = this.search()!; */

  constructor() {
    effect(() => {
      this.loadEvents();

      if (this.search() !== '') {
        this.page.set(1);
      }

      /* const currentValue = this.search();

      if (currentValue !== this.previousValue) {
        console.log('La señal ha cambiado de valor:', {
          previous: this.previousValue,
          current: currentValue,
        });

        // Actualiza el valor anterior
        this.previousValue = currentValue!;
        this.page.set(1);
      } */
    });
  }

  ngOnInit() {
  }

  loadEvents() {
    this.#eventsService
      .getEvents(this.page(), this.order(), this.search()!, this.creator(), this.attending())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((events) => {
        if (this.page() === 1) {
          this.events.set(events.events);
        } else {
          this.events.update(existingEvents => [...existingEvents, ...events.events]);
        }
        if (this.creator()) {
          this.getName(this.creator()!).subscribe((name) => {
            this.name.set(name);
          });
        } else if (this.attending()) {
          this.getName(this.attending()!).subscribe((name) => {
            this.name.set(name);
          });
        } else {
          this.name.set('All Events');
        }
        this.count.set(events.count);
        console.log(this.count());
        console.log(this.events().length);
      });
  }

  getName(id: number) {
    return this.#profileService.getProfile(id).pipe(map((user) => user.name));
  }

  deleteEvent(event: MyEvent) {
    this.events.update(events => events.filter((e) => e !== event));
  }

  loadMoreEvents(infinite?: IonInfiniteScroll) {
    // Simulamos una llamada a un servicio externo con un timeout
    setTimeout(
      () => {
        if (this.events().length < this.count()) {
          this.page.update(page => page + 1);
        } else {
          this.finished = true;
        }

        infinite?.complete(); // Esconder animación al terminar de cargar
      },
      infinite ? 2000 : 0 // En la carga inicial no tardamos nada
    );
  }
}
