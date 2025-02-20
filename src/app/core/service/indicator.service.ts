import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "./error-handler.service";
import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { IChallenge } from "../interfaces/challenge.interface";
import { IHttpGetRequestBody, IHttpGetResponseBody } from "../interfaces/http-get.interface";
import { IIndicator } from "../interfaces/indicator.interface";
import { PageableQueryStringParametersHelper } from "../helpers/pageable-query-string-parameters.helper";
import { IManagementOrganizerChallenge } from "../interfaces/managament-organizer-challente.interface";

@Injectable({
  providedIn: 'root',
})
export class IndicatorService {

  private _url = `${environment.apiUrl}/indicator`

  constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) { }

  public getIndicators(pageConfig: IHttpGetRequestBody): Observable<IHttpGetResponseBody<IIndicator>> {
    return this._http.get<IHttpGetResponseBody<IIndicator>>(`${this._url}`, {
      params:
        PageableQueryStringParametersHelper.buildQueryStringParams(pageConfig),
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => err);
      })
    );
  }

  public getManagementOrganizerChallenges(): Observable<IManagementOrganizerChallenge[]> {
    const url = `${this._url}/getManagementOrganizerChallenges`;
    return this._http.get<IManagementOrganizerChallenge[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => new Error('Erro ao obter o desafio'));
      })
    );
  }

  public getDistinctMeasureUnits(): Observable<string[]> {
    const url = `${this._url}/measure-units`;
    return this._http.get<string[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => new Error('Erro ao obter as unidade de medidas'));
      })
    );
  }

  public getDistinctOrganizationAcronyms(): Observable<string[]> {
    const url = `${this._url}/organization-acronym`;
    return this._http.get<string[]>(url).pipe(
      catchError((err: HttpErrorResponse) => {
        this._errorHandlerService.handleError(err);
        return throwError(() => new Error('Erro ao obter as siglas de orgãos'));
      })
    );
  }
  
}