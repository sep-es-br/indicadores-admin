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

  constructor(private managementService: ManagementService, private _r2: Renderer2, private router: Router, private toastrService: NbToastrService, private dialogService: NbDialogService,) { 
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

  public deleteManagement(managementId: string): void {
    this.dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          title: 'Confirmação', 
          message: 'Tem certeza de que deseja excluir esta gestão?', 
        },
      })
      .onClose.subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.managementService.deleteManagement(managementId)
            .pipe(finalize(() => this.fetchPage()))
            .subscribe({
              next: () => this.toastrService.show(
                '', 'Gestão deletada com sucesso!',
                { status: 'success', duration: 8000 }
              ),
              error: (err) => this.toastrService.show(
                'Erro ao excluir a gestão: ' + err.message,
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
