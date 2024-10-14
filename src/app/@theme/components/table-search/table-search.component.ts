import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ["./table-search.component.scss"]
})
export class TableSearchComponent {

  @Output() filtroPesquisaOutput = new EventEmitter<string>();

  public filtroPesquisa: string = '';

  constructor() {}

  public aplicarFiltroPesquisa() {
    this.filtroPesquisaOutput.emit(this.filtroPesquisa);
  }
}
