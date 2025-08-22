import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private selectedProviderId = new BehaviorSubject<number | null>(null);

  setProviderId(id: number) {
    this.selectedProviderId.next(id);
  }

  getProviderId() {
    return this.selectedProviderId.asObservable();
  }
}
