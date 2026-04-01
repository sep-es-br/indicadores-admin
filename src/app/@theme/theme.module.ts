import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbCardModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  SearchInputComponent,
  TinyMCEComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TableSearchComponent } from './components/table-search/table-search.component';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/ConfirmationDialog.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbCardModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NgbPaginationModule,
  ConfirmationDialogComponent,
];
const COMPONENTS = [
  HeaderComponent,
  FooterComponent,
  BreadcrumbComponent,
  TableSearchComponent,
  PaginationComponent,
  SearchInputComponent,
  TinyMCEComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
];
const PIPES = [
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

export enum AvailableThemes {
  DEFAULT = 'default',
  DARK = 'dark',
  COSMIC = 'cosmic',
};

export interface AvailableThemesStyles {
  themePrimaryColor: string;
  themeSecondaryColor: string;
  textPrimaryColor: string;
  textSecondaryColor: string;
}

export const getAvailableThemesStyles = (theme: AvailableThemes): AvailableThemesStyles => {
  switch (theme) {
    case AvailableThemes.DEFAULT:
      return {
        themePrimaryColor: '#FFFFFF',
        themeSecondaryColor: '#EDF1F7',
        textPrimaryColor: '#505050',
        textSecondaryColor: '#000000',
      };
    case AvailableThemes.DARK:
      return {
        themePrimaryColor: '#151A30',
        themeSecondaryColor: '#222B45',
        textPrimaryColor: '#FFFFFF',
        textSecondaryColor: '#505050',
      };
    case AvailableThemes.COSMIC:
      return {
        themePrimaryColor: '#1B1B38',
        themeSecondaryColor: '#323259',
        textPrimaryColor: '#FFFFFF',
        textSecondaryColor: '#505050',
      };
    default:
      return {
        themePrimaryColor: '#FFFFFF',
        themeSecondaryColor: '#EDF1F7',
        textPrimaryColor: '#000000',
        textSecondaryColor: '#505050',
      };
  }
};

@NgModule({
  imports: [CommonModule,RouterModule,FormsModule, ...NB_MODULES],
  exports: [CommonModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
