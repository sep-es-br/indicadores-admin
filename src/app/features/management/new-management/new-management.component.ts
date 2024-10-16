import { Component, OnInit, Renderer2 } from '@angular/core';


@Component({
  selector: 'ngx-new-management',
  templateUrl: './new-management.component.html',
  styleUrls: ['./new-management.component.scss']
})
export class NewManagementComponent{

  // private _pageConfig: IHttpGetRequestBody = {
  //   page: 0,
  //   search: '',
  //   size: 8,
  //   sort: '',
  // };

  // private _managementList: BehaviorSubject<Array<IManagement>> =
  // new BehaviorSubject<Array<IManagement>>([]);
  
  // public get managementList(): Observable<Array<IManagement>> {
  //   return this._managementList;
  // }

  // public loading: boolean = true;

  // public breadcrumb: Array<IBreadcrumbItem> = [];

  // public managements: IManagement;

  // public paginacaoDados: IPaginacaoDados = {
  //   paginaAtual: 1,
  //   itensPorPagina: 8,
  //   primeiroItemPagina: 1,
  //   ultimoItemPagina: 8,
  //   totalRegistros: 50,
  // };

  constructor() { 
  }



  // private fetchPage(pageConfigParam?: {
  //   [K in keyof IHttpGetRequestBody]?: IHttpGetRequestBody[K];
  // }): void {
  //   const tempPageConfig = { ...this._pageConfig, ...pageConfigParam };

  //   this.managementService.getManagements(tempPageConfig).pipe(tap((response) => {
  //     this._managementList.next(response.content);

  //     this.paginacaoDados = {
  //       paginaAtual: response.pageable.pageNumber + 1,
  //       itensPorPagina: response.pageable.pageSize,
  //       primeiroItemPagina: response.pageable.offset + 1,
  //       ultimoItemPagina:
  //         response.pageable.offset + response.numberOfElements,
  //       totalRegistros: response.totalElements,
  //     };
  //   }),
  //   finalize(() => (this.loading = false, this.updateBreadcrumb()))
  // )
  // .subscribe();

  // }

  // public filtroPesquisaOutputEvent(filtro: string): void {
  //   this._pageConfig.search = filtro;

  //   if (!filtro) {
  //     this._pageConfig.sort = '';
  //     this.limparSortColumn();
  //   }

  //   this.fetchPage();
  // }

  // public paginacaoOutputEvent(event: number): void {
  //   this.fetchPage({ page: event - 1 });
  // }

  // updateBreadcrumb() {
	// 	this.breadcrumb = [
	// 		{
	// 			label: 'Gestão Administrativa',
	// 		},

	// 	];
	// }

  // private limparSortColumn(): void {
  //   document.querySelectorAll('th[ng-reflect-sortable]').forEach((el) => {
  //     this._r2.removeClass(el, 'asc');
  //     this._r2.removeClass(el, 'desc');
  //   });
  // }

}
