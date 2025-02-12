import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventCommunicationService {
  private attendChangedSource = new Subject<void>();
  attendChanged$ = this.attendChangedSource.asObservable();

  emitAttendChanged() {
    this.attendChangedSource.next();
  }
}