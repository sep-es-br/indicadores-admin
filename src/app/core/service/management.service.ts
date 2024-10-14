import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { Observable, throwError } from "rxjs";
import { IManagement } from "../interfaces/management.interface";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root',
  })
  export class ManagementService{

    private _url = `${environment.apiUrl}/management`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}

    public getManagements(): Observable<IManagement> {
        return this._http.get<IManagement>(`${this._url}`).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
          })
        );
      }

  }