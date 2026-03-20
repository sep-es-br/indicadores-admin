import { Component, inject } from "@angular/core";

import { MENU_ITEMS } from "./pages-menu";
import { NbMenuService, NbThemeService } from "@nebular/theme";

@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu = MENU_ITEMS;

  private _themeService = inject(NbThemeService);
  constructor() {
    let currentTheme = localStorage.getItem("indicadtorCurrentTheme");
    if (currentTheme) {
      this._themeService.changeTheme(currentTheme);
    } else {
      currentTheme = this._themeService.currentTheme;
      localStorage.setItem("indicadtorCurrentTheme", currentTheme);
    }

    this._themeService
      .onThemeChange()
      .subscribe((newTheme: { name: string; previous: string }) => {
        localStorage.setItem("indicadtorCurrentTheme", newTheme.name);
      });
  }
}
