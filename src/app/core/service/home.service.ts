import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IOds } from "../interfaces/ods.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorHandlerService } from "./error-handler.service";

@Injectable({
    providedIn: 'root',
  })
  export class HomeService{

    private _url = `${environment.apiUrl}/home-info`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}


    public getOdsInfo(order: Number): Observable<IOds> {
        return this._http.get<IOds>(`${this._url}/ods?order=${order}`).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
          })
        );
      }
  }