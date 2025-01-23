import { Component, OnInit, Renderer2 } from '@angular/core';
import { IManagement } from '../../core/interfaces/management.interface';
import { ManagementService } from '../../core/service/management.service';
import { IBreadcrumbItem } from '../../core/interfaces/breadcrumb-item.interface';
import { IPaginacaoDados } from '../../core/interfaces/paginacao-dados.interface';
import { IHttpGetRequestBody } from '../../core/interfaces/http-get.interface';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { finalize, tap } from 'rxjs/operators';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';


@Component({
  selector: 'ngx-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit{

  private _pageConfig: IHttpGetRequestBody = {
    page: 0,
    search: '',
    size: 8,
    sort: '',
  };

  private _managementList: BehaviorSubject<Array<IManagement>> =
  new BehaviorSubject<Array<IManagement>>([]);
  
  public get managementList(): Observable<Array<IManagement>> {
    return this._managementList;
  }

  public isEditing: boolean = false;
  public isViewer: boolean = false; 

  selectedManagement: IManagement = {
    id: '',
    name: '',
    description: '',
    startYear: 0,
    endYear: 0,
    active: false,
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

  constructor(private managementService: ManagementService, private _r2: Renderer2, private router: Router) { 
  }

  ngOnInit(): void {
    this.fetchPage();
    
  }


  private fetchPage(pageConfigParam?: {
    [K in keyof IHttpGetRequestBody]?: IHttpGetRequestBody[K];
  }): void {
    const tempPageConfig = { ...this._pageConfig, ...pageConfigParam };

    this.managementService.getManagements(tempPageConfig).pipe(tap((response) => {
      this._managementList.next(response.content);
      console.log(response.content)
      this.paginacaoDados = {
        paginaAtual: response.pageable.pageNumber + 1,
        itensPorPagina: response.pageable.pageSize,
        primeiroItemPagina: response.pageable.offset + 1,
        ultimoItemPagina:
          response.pageable.offset + response.numberOfElements,
        totalRegistros: response.totalElements,
      };
    }),
    finalize(() => (this.loading = false, this.updateBreadcrumb()))
  )
  .subscribe();

  }

  public deleteManagement(managementId: string): void {
    if (confirm('Tem certeza de que deseja excluir esta gestão?')) {
      this.managementService.deleteManagement(managementId)
        .pipe(finalize(() => this.fetchPage())) 
        .subscribe({
          next: () => alert('Gestão excluída com sucesso!'),
          error: (err) => alert('Erro ao excluir a gestão: ' + err.message),
        });
    }
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
				label: 'Gestão Administrativa',
			},

		];
	}

  private limparSortColumn(): void {
    document.querySelectorAll('th[ng-reflect-sortable]').forEach((el) => {
      this._r2.removeClass(el, 'asc');
      this._r2.removeClass(el, 'desc');
    });
  }

  editManagement(management: IManagement): void {
    this.router.navigate(['/pages/management/edit'], { queryParams: management });
  }

  viewManagement(management: IManagement): void {
    this.selectedManagement = { ...management };
    this.isViewer = true; 
    this.isEditing = false;
    this.breadcrumb = [
			{
				label: 'Gestão Administrativa',
			},
      {
				label: 'Visualizar',
			},
		];
  }
  
  cancelEdit(): void {
    this.isEditing = false;
    this.isViewer = true;
    this.breadcrumb = [
			{
				label: 'Gestão Administrativa',
			},
      {
				label: 'Visualizar',
			},
		];
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    this.isViewer = !this.isEditing;
  }
  
  saveManagement(): void {
    if (this.selectedManagement) {
      // Lógica para salvar a gestão (chamada ao serviço)
      // this.managementService.updateManagement(this.selectedManagement).subscribe(() => {
      //   // Atualiza a lista de gestões ou exibe uma mensagem de sucesso
      this.isEditing = false;
      this.isViewer = true;
      // });
    }
  }
  
  onBreadcrumbClick(data: any) {
    // Lógica dinâmica dependendo do item clicado
    console.log('Breadcrumb clicado:', data);
  }

}
