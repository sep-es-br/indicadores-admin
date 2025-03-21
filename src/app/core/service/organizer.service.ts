import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "./error-handler.service";
import { environment } from "../../../environments/environment";
import { IHttpGetRequestBody, IHttpGetResponseBody } from "../interfaces/http-get.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PageableQueryStringParametersHelper } from "../helpers/pageable-query-string-parameters.helper";
import { IOrganizerAdmin, IOrganizerItem, IStructure, IStructureChild } from "../interfaces/organizer.interface";
import { IManagement } from "../interfaces/management.interface";

@Injectable({
    providedIn: 'root',
  })
  export class OrganizerService{

    private _url = `${environment.apiUrl}/organizer`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}

    public getOrganizerList(
        pageConfig: IHttpGetRequestBody
    ): Observable<IHttpGetResponseBody<IOrganizerAdmin>> {

        const url = `${this._url}/getAll`;
       
        const params = PageableQueryStringParametersHelper.buildQueryStringParams(pageConfig);

        return this._http
        .get<IHttpGetResponseBody<IOrganizerAdmin>>(url, { params })
        .pipe(
            catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
            })
        );
    }

    public createOrganizer(organizers: IOrganizerItem[], managementId: string): Observable<void> {
        return this._http.post<void>(`${this._url}/${managementId}`, organizers).pipe(
            catchError((err: HttpErrorResponse) => {
              this._errorHandlerService.handleError(err);
              return throwError(() => err); 
            })
        );
      }
    
    public createOrganizerChildren(organizers: IOrganizerItem[], organizerId: string): Observable<void> {
        const url = `${this._url}/${organizerId}/children`;
        
        return this._http.post<void>(url, organizers).pipe(
            catchError((err: HttpErrorResponse) => {
                this._errorHandlerService.handleError(err);
                return throwError(() => err);
            })
        );
    }
        
    public deleteOrganizer(organizerId: string): Observable<void> {
        const url = `${this._url}/${organizerId}`;
        return this._http.delete<void>(url).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err); 
          })
        );
      }
    
    public getOrganizer(organizerUuId: string): Observable<IOrganizerItem> {
        const url = `${this._url}/getOrganizer/${organizerUuId}`;
        return this._http.get<IOrganizerItem>(url).pipe(
          catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => new Error('Erro ao obter a estrutura do organizador'));
          })
        );
      }
      
    public updateOrganizer(organizer: IOrganizerItem): Observable<void> {
      return this._http.put<void>(this._url, organizer).pipe(
        catchError((err: HttpErrorResponse) => {
          this._errorHandlerService.handleError(err);
          return throwError(() => err); 
        })
      );
    }

  }