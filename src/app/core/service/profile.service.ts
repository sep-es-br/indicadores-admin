import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

import {BehaviorSubject, Observable, throwError} from 'rxjs';
import { environment } from '../../../environments/environment';
import { IProfile } from '../interfaces/profile.interface';
import { ErrorHandlerService } from './error-handler.service';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private _url = `${environment.apiUrl}/signin`;
  private _sessionProfileSubject = new BehaviorSubject<IProfile>({token:"", name:"", email:"", role:[]});
  public sessionProfile$ = this._sessionProfileSubject.asObservable();

  constructor(
    private _http: HttpClient,
    private _errorHandlerService: ErrorHandlerService,
  ) { }

  public getUserInfo(): Observable<IProfile> {
    return this._http.get<IProfile>(`${this._url}/user-info`).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  public getTokenInfo(urlToken: string): Observable<IProfile> {
    return this._http.get<IProfile>(`${this._url}/token-info`).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }
}
