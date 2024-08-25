import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabStateService {
  private currentTabSubject = new BehaviorSubject<string>('Login');
  currentTab$ = this.currentTabSubject.asObservable();

  setCurrentTab(tabName: string) {
    this.currentTabSubject.next(tabName);
  }

  getCurrentTab(): string {
    return this.currentTabSubject.value;
  }
}
