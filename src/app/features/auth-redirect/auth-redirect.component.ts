import {Component} from '@angular/core';
import {Router} from '@angular/router';



import { IProfile } from '../../core/interfaces/profile.interface';
import { ProfileService } from '../../core/service/profile.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-indicadores-auth-redirect',
  standalone: false,
  templateUrl: './auth-redirect.component.html',
})
export class AuthRedirectComponent {
  constructor(
    private _router: Router,
    private _profileService: ProfileService,
    private toastrService: NbToastrService,
  ) {
    const tokenQueryParamMap =
      this._router.getCurrentNavigation()?.initialUrl.queryParamMap;

    if (tokenQueryParamMap?.has('token')) {
      sessionStorage.setItem(
        'token',
        atob(tokenQueryParamMap.get('token') as string)
      );
    }

    this._profileService
      .getUserInfo()
      .pipe(
        tap((response: IProfile) => {
          const indicadoresToken = response.token;

          sessionStorage.setItem('token', indicadoresToken);
        }),
        tap((response: IProfile) => {
          const userProfile = {
            name: response.name,
            email: response.email,
            role: response.role,
          };
          if (!response.role.includes('INDICADORES_ADMIN')) {
            this.toastrService.show(
              'Acesso negado: Você não tem permissão para acessar essa aplicação',
              'Atenção',
              { status: 'warning', duration: 8000 }
            );
            sessionStorage.clear(); 
            this._router.navigate(['/login']); 
            return;
          }

          sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
          this._router.navigate(['pages']);
        }),
        catchError((error) => {
          console.error('Erro ao obter informações do perfil:', error);
          sessionStorage.clear();
          this._router.navigate(['/login']);
          return of(null);
        })
      )
      .subscribe();
  }
}
