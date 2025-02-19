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
import { IOrganizerAdmin } from '../../core/interfaces/organizer.interface';
import { OrganizerService } from '../../core/service/organizer.service';
import { ChallengeService } from '../../core/service/challenge.service';
import { IIndicator } from '../../core/interfaces/indicator.interface';
import { IndicatorService } from '../../core/service/indicator.service';


@Component({
  selector: 'ngx-indicator',
  templateUrl: './indicator.component.html',
  styleUrls: ['./indicator.component.scss']
})
export class IndicatorComponent implements OnInit{

  private _pageConfig: IHttpGetRequestBody = {
    page: 0,
    search: '',
    size: 12,
    sort: '',
  };

  private _indicatorList: BehaviorSubject<Array<IIndicator>> =
  new BehaviorSubject<Array<IIndicator>>([]);
  
  public get indicatorList(): Observable<Array<IIndicator>> {
    return this._indicatorList;
  }

  public loading: boolean = true;

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public paginacaoDados: IPaginacaoDados = {
    paginaAtual: 1,
    itensPorPagina: 8,
    primeiroItemPagina: 1,
    ultimoItemPagina: 8,
    totalRegistros: 50,
  };

  constructor(private indicatorService: IndicatorService, private _r2: Renderer2, private toastrService: NbToastrService, private dialogService: NbDialogService,) { 
  }
    
  
  ngOnInit(): void {
    this.fetchPage();
  }

  private fetchPage(pageConfigParam?: {
      [K in keyof IHttpGetRequestBody]?: IHttpGetRequestBody[K];
    }): void {
      const tempPageConfig = { ...this._pageConfig, ...pageConfigParam };
  
      this.indicatorService.getIndicators(tempPageConfig).pipe(tap((response) => {
        this._indicatorList.next(response.content);
        this.paginacaoDados = {
          paginaAtual: response.page.number + 1,  
          itensPorPagina: response.page.size,
          primeiroItemPagina: response.page.number * response.page.size + 1,
          ultimoItemPagina: response.page.number * response.page.size + response.content.length,
          totalRegistros: response.page.totalElements,
        };
      }),
      finalize(() => (this.loading = false, this.updateBreadcrumb()))
    )
    .subscribe();
  
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

    private limparSortColumn(): void {
      document.querySelectorAll('th[ng-reflect-sortable]').forEach((el) => {
        this._r2.removeClass(el, 'asc');
        this._r2.removeClass(el, 'desc');
      });
    }
    
  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Indicadores',
			},

		];
	}

}
