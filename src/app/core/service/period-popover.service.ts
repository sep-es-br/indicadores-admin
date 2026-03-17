import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodPopoverService {
  private close$ = new Subject<{ year: number; type: string } | null>();
  onClose$ = this.close$.asObservable();

  close(data?: { year: number; type: string }) {
    this.close$.next(data ?? null);
  }
}
