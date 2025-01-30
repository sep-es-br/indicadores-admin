import { Component, OnInit, Renderer2 } from '@angular/core';
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
    size: 9,
    sort: '',
  };

  private _organizerList: BehaviorSubject<Array<IOrganizerAdmin>> =
  new BehaviorSubject<Array<IOrganizerAdmin>>([]);
  
  public get organizerList(): Observable<Array<IOrganizerAdmin>> {
    return this._organizerList;
  }

  public loading: boolean = true;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public paginacaoDados: IPaginacaoDados = {
    paginaAtual: 1,
    itensPorPagina: 9,
    primeiroItemPagina: 1,
    ultimoItemPagina: 9,
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
  
    this.organizerService.getOrganizerList(tempPageConfig).pipe(
      tap((response) => {
        this._organizerList.next(response.content);
        this.paginacaoDados = {
          paginaAtual: response.page.number + 1,  
          itensPorPagina: response.page.size,
          primeiroItemPagina: response.page.number * response.page.size + 1,
          ultimoItemPagina: response.page.number * response.page.size + response.content.length,
          totalRegistros: response.page.totalElements,
        };
      }),
      finalize(() => {
        this.loading = false;
        this.updateBreadcrumb();
      })
    ).subscribe();
  }

  public deleteOrganizer(organizerId: string): void {
    this.dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          title: 'Confirmação', 
          message: 'Tem certeza de que deseja excluir este organizador?', 
        },
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.organizerService.deleteOrganizer(organizerId)
            .pipe(finalize(() => this.fetchPage({ page: this.paginacaoDados.paginaAtual - 1 })))
            .subscribe({
              next: () => this.toastrService.show(
                '', 'Organizador deletado com sucesso!',
                { status: 'success', duration: 8000 }
              ),
              error: (err) => this.toastrService.show(
                'Erro ao excluir a organizador: ' + err.message,
                'Erro', { status: 'danger', duration: 8000 }
              ),
            });
        }
      });
    }
  
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

  editOrganizer(organizerId: string): void {
    this.router.navigate(['/pages/organizer/edit'], { queryParams: { id: organizerId } });
  }

}
