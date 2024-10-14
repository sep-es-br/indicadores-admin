import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <div class="p-1">
    <span class="title">
    Indicadores {{currentYear}} - Secretaria de Economia e Planejamento do Espírito Santo 
    </span>
  </div>
  `,
})
export class FooterComponent {

  public currentYear = new Date().getFullYear();

  constructor() { }


}
