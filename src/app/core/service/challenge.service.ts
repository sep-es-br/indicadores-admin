import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "./error-handler.service";
import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IChallenge } from "../interfaces/challenge.interface";

@Injectable({
    providedIn: 'root',
  })
  export class ChallengeService{

    private _url = `${environment.apiUrl}/challenge`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}

    public getChallenge(challengeId: string): Observable<IChallenge> {
        const url = `${this._url}/getChallenge/${challengeId}`;
        return this._http.get<IChallenge>(url).pipe(
              catchError((err: HttpErrorResponse) => {
                this._errorHandlerService.handleError(err);
                return throwError(() => new Error('Erro ao obter o desafio'));
            })
        );
    }

    
    public createChallenge(challengeList: IChallenge[], organizerId: string): Observable<void> {
        const url = `${this._url}/${organizerId}`;
        
        return this._http.post<void>(url, challengeList).pipe(
            catchError((err: HttpErrorResponse) => {
                this._errorHandlerService.handleError(err);
                return throwError(() => err);
            })
        );
    }

    public deleteChallenge(challengeId: string): Observable<void> {
        const url = `${this._url}/${challengeId}`;
        return this._http.delete<void>(url).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err); 
          })
        );
      }
    
    public updateChallenge(challenge: IChallenge): Observable<void> {
        return this._http.put<void>(this._url, challenge).pipe(
             catchError((err: HttpErrorResponse) => {
               this._errorHandlerService.handleError(err);
               return throwError(() => err); 
             })
           );
         }

  }