import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-table-search',
  templateUrl: './table-search.component.html',
  styleUrls: ["./table-search.component.scss"]
})
export class TableSearchComponent implements OnInit {

  @Output() filtroPesquisaOutput = new EventEmitter<string>();

  public filtroPesquisa: string = '';

  constructor() {}

  ngOnInit(): void {
    this.aplicarFiltroPesquisa();
  }

  public aplicarFiltroPesquisa() {
    this.filtroPesquisaOutput.emit(this.filtroPesquisa);
  }
}
