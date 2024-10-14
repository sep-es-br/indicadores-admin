import { Component, OnInit } from '@angular/core';
import { IManagement } from '../../core/interfaces/management.interface';
import { ManagementService } from '../../core/service/management.service';
import { IBreadcrumbItem } from '../../core/interfaces/breadcrumb-item.interface';
import { IPaginacaoDados } from '../../core/interfaces/paginacao-dados.interface';


@Component({
  selector: 'ngx-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss']
})
export class ManagementComponent implements OnInit{

  public breadcrumb: Array<IBreadcrumbItem> = [];

  public managements: IManagement;

  public paginacaoDados: IPaginacaoDados = {
    paginaAtual: 1,
    itensPorPagina: 15,
    primeiroItemPagina: 1,
    ultimoItemPagina: 15,
    totalRegistros: 200,
  };

  constructor(private managementService: ManagementService) { 
  }

  ngOnInit(): void {
    this.getManagements();
  }
  
  getManagements(){
    this.managementService.getManagements().subscribe(
      data => {
        this.managements = data;
        this.updateBreadcrumb()
      },
      error => {
        console.error('Erro ao obter as Gestoes:', error);
      }
    );
  }

  public filtroPesquisaOutputEvent(filtro: string): void {
    console.log(filtro)
    // this._pageConfig.search = filtro;

    // if (!filtro) {
    //   this._pageConfig.sort = '';
    //   this.limparSortColumn();
    // }

    // this.fetchPage();
  }

  public paginacaoOutputEvent(event: number): void {
    // this.fetchPage({ page: event - 1 });
  }

  updateBreadcrumb() {
		this.breadcrumb = [
			{
				label: 'Gestão Administrativa',
			},

		];
	}

}
