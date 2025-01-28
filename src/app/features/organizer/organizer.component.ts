import { Component, OnInit, Renderer2 } from '@angular/core';
import { IManagement } from '../../core/interfaces/management.interface';
import { ManagementService } from '../../core/service/management.service';
import { IBreadcrumbItem } from '../../core/interfaces/breadcrumb-item.interface';
import { IPaginacaoDados } from '../../core/interfaces/paginacao-dados.interface';
import { IHttpGetRequestBody } from '../../core/interfaces/http-get.interface';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { finalize, tap } from 'rxjs/operators';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../@theme/components/confirmation-dialog/ConfirmationDialog.component';
import { OrganizerService } from '../../core/service/organizer.service';
import { IOrganizerAdmin } from '../../core/interfaces/organizer.interface';


@Component({
  selector: 'ngx-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit{

  private _pageConfig: IHttpGetRequestBody = {
    page: 0,
    search: '',
    size: 8,
    sort: '',
  };

  private _organizerList: BehaviorSubject<Array<IOrganizerAdmin>> =
  new BehaviorSubject<Array<IOrganizerAdmin>>([]);
  
  public get organizerList(): Observable<Array<IOrganizerAdmin>> {
    return this._organizerList;
  }

  selectedManagement: IOrganizerAdmin = {
    nameAdministration: '',
    nameOrganizer: '',
    typeOrganizer: '',
    idOrganizer: '',
    children: []
  };

  public loading: boolean = true;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public managements: IManagement;

  public paginacaoDados: IPaginacaoDados = {
    paginaAtual: 1,
    itensPorPagina: 8,
    primeiroItemPagina: 1,
    ultimoItemPagina: 8,
    totalRegistros: 50,
  };

  constructor(private organizerService: OrganizerService, private _r2: Renderer2, private router: Router, private toastrService: NbToastrService, private dialogService: NbDialogService,) { 
  }

  ngOnInit(): void {
    this.fetchPage();
    
  }


  private fetchPage(pageConfigParam?: {
    [K in keyof IHttpGetRequestBody]?: IHttpGetRequestBody[K];
  }): void {
    const tempPageConfig = { ...this._pageConfig, ...pageConfigParam };

    this.organizerService.getOrganizerList(tempPageConfig).pipe(tap((response) => {
      this._organizerList.next(response.content);
      this.paginacaoDados = {
        paginaAtual: response.pageable.pageNumber + 1,
        itensPorPagina: response.pageable.pageSize,
        primeiroItemPagina: response.pageable.offset + 1,
        ultimoItemPagina:
          response.pageable.offset + response.numberOfElements,
        totalRegistros: response.totalElements,
      };
    }),
    finalize(() => {
      this.loading = false;
      this.updateBreadcrumb();
    })
  )
  .subscribe();

  }

  // public deleteManagement(managementId: string): void {
  //   this.dialogService
  //     .open(ConfirmationDialogComponent, {
  //       context: {
  //         title: 'Confirmação', 
  //         message: 'Tem certeza de que deseja excluir esta gestão?', 
  //       },
  //     })
  //     .onClose.subscribe((confirmed: boolean) => {
  //       if (confirmed) {
  //         this.managementService.deleteManagement(managementId)
  //           .pipe(finalize(() => this.fetchPage()))
  //           .subscribe({
  //             next: () => this.toastrService.show(
  //               '', 'Gestão deletada com sucesso!',
  //               { status: 'success', duration: 8000 }
  //             ),
  //             error: (err) => this.toastrService.show(
  //               'Erro ao excluir a gestão: ' + err.message,
  //               'Erro', { status: 'danger', duration: 8000 }
  //             ),
  //           });
  //       }
  //     });
  // }
  

  public filtroPesquisaOutputEvent(filtro: string): void {
    this._pageConfig.search = filtro;

    if (!filtro) {
      this._pageConfig.sort = '';
      this.limparSortColumn();
    }

    this.fetchPage();
  }

  public paginacaoOutputEvent(event: number): void {
    this.fetchPage({ page: event - 1 });
  }

  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Organizador',
			},

		];
	}

  private limparSortColumn(): void {
    document.querySelectorAll('th[ng-reflect-sortable]').forEach((el) => {
      this._r2.removeClass(el, 'asc');
      this._r2.removeClass(el, 'desc');
    });
  }

  // editManagement(management: IManagement): void {
  //   this.router.navigate(['/pages/management/edit'], { queryParams: management });
  // }

  
  
}
