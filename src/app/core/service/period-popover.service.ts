import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PeriodPopoverService {
  private close$ = new Subject<{ year: number; type: string } | null>();
  onClose$ = this.close$.asObservable();
  private closeInterval$ = new Subject<{
    from: number;
    to: number;
    type: string;
  } | null>();
  onCloseInterval$ = this.closeInterval$.asObservable();

  close(data?: { year: number; type: string }) {
    this.close$.next(data ?? null);
  }

  closeInterval(data?: { from: number; to: number; type: string }) {
    this.closeInterval$.next(data ?? null);
  }
}
