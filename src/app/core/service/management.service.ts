import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ErrorHandlerService } from "./error-handler.service";
import { Observable, throwError } from "rxjs";
import { IManagement } from "../interfaces/management.interface";
import { catchError } from "rxjs/operators";
import { IHttpGetRequestBody, IHttpGetResponseBody } from "../interfaces/http-get.interface";
import { PageableQueryStringParametersHelper } from "../helpers/pageable-query-string-parameters.helper";

@Injectable({
    providedIn: 'root',
  })
  export class ManagementService{

    private _url = `${environment.apiUrl}/management`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}

    public getManagements(pageConfig: IHttpGetRequestBody): Observable<IHttpGetResponseBody<IManagement>> {
        return this._http.get<IHttpGetResponseBody<IManagement>>(`${this._url}`,{
          params:
            PageableQueryStringParametersHelper.buildQueryStringParams(pageConfig),
        }).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
          })
        );
      }

      public createManagement(management: IManagement): Observable<IManagement> {
        return this._http.post<IManagement>(this._url, management).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
          })
        );
      }

      public deleteManagement(managementId: string): Observable<void> {
        const url = `${this._url}/${managementId}`;
        return this._http.delete<void>(url).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err); 
          })
        );
      }

      public updateManagement(management: IManagement): Observable<void> {
        return this._http.put<void>(this._url, management).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err); 
          })
        );
      }
      
  }
