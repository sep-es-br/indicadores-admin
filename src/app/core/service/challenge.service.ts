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

    
    public createChallenge(challengeList: IChallenge[], organizerId: string): Observable<void> {
        const url = `${this._url}/${organizerId}`;
        
        return this._http.post<void>(url, challengeList).pipe(
            catchError((err: HttpErrorResponse) => {
                this._errorHandlerService.handleError(err);
                return throwError(() => err);
            })
        );
    }
     

  }