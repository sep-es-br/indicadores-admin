import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ErrorHandlerService } from "./error-handler.service";
import { environment } from "../../../environments/environment";
import { IHttpGetRequestBody, IHttpGetResponseBody } from "../interfaces/http-get.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PageableQueryStringParametersHelper } from "../helpers/pageable-query-string-parameters.helper";
import { IOrganizerAdminDto } from "../interfaces/organizer.interface";

@Injectable({
    providedIn: 'root',
  })
  export class OrganizerService{

    private _url = `${environment.apiUrl}/organizer`

    constructor(private _http: HttpClient, private _errorHandlerService: ErrorHandlerService) {}

    public getOrganizerList(
        pageConfig: IHttpGetRequestBody
    ): Observable<IHttpGetResponseBody<IOrganizerAdminDto>> {

        const url = `${this._url}/getAll`;
       
        const params = PageableQueryStringParametersHelper.buildQueryStringParams(pageConfig);

        return this._http
        .get<IHttpGetResponseBody<IOrganizerAdminDto>>(url, { params })
        .pipe(
            catchError((err: HttpErrorResponse) => {
            this._errorHandlerService.handleError(err);
            return throwError(() => err);
            })
        );
    }
  }