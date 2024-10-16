import { Component, EventEmitter, Input, Output } from '@angular/core';

import { IPaginacaoDados } from '../../../core/interfaces/paginacao-dados.interface';


@Component({
  selector: 'ngx-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ["./pagination.component.scss"]
})
export class PaginationComponent {
  @Input() public paginacaoDadosInput: IPaginacaoDados = {
    paginaAtual: 1,
    itensPorPagina: 15,
    primeiroItemPagina: 0,
    ultimoItemPagina: 0,
    totalRegistros: 0,
  };


  @Output() public paginacaoOutput = new EventEmitter<number>();

  constructor() {}

  public ngbPaginationPageChangeEvent(event: number): void {
    this.paginacaoOutput.emit(event);
  }


}
