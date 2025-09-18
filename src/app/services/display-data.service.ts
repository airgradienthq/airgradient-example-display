import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { delay, retryWhen, switchMap, takeUntil } from 'rxjs/operators';

import { MessageService } from 'src/app/services/message.service';

const DISPLAY_DATA_REFRESH_INTERVAL = 120000;

@Injectable({
  providedIn: 'root'
})
export class DisplayDataService {
  public currentDisplayData?: any[];
  private _loadingDisplayData$ = new BehaviorSubject<boolean>(false);
  private _stopCurrentRequest$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private _messageService: MessageService
  ) { }

  startGettingDisplayMeasuresData(api_token: string): void {
    this._stopCurrentRequest$.next();

    timer(0, DISPLAY_DATA_REFRESH_INTERVAL)
      .pipe(
        takeUntil(this._stopCurrentRequest$),
        switchMap(() =>{
          this._loadingDisplayData$.next(true);
          return this.http.get<any[]>(`/api-int/public/api/v1/locations/measures/current?token=${ api_token }`);
        }),
        retryWhen((errors) =>
          errors.pipe(
            delay(1000),
            takeUntil(this._stopCurrentRequest$)
          )
        )
      )
      .subscribe({
        next: (data: any[]) => {
          this.currentDisplayData = data;
          this._messageService.sendMessage('display_data_refreshed');
          this._loadingDisplayData$.next(false);
        },
        error: () => {
          this._loadingDisplayData$.next(false);
          this._stopCurrentRequest$.next();
        }
      });
  }

  get loadingDisplayData$(): Observable<boolean> {
    return this._loadingDisplayData$.asObservable();
  }
}
