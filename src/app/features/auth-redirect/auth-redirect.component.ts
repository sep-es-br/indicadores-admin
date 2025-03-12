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
            roles: response.role ?? []
          };

          const userRoles = response.role ?? [];
          
          if (!userRoles.includes('INDICADORES_ADMIN')) {
            sessionStorage.clear(); 
            this._router.navigate(['/login'], {
              state: { authError: 'Acesso negado: Você não tem permissão para acessar essa aplicação' }
            });
            return;
          }

          sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
          this._router.navigate(['pages']);
        }),
        catchError((error) => {
          console.error('Erro ao obter informações do perfil:', error);
          sessionStorage.clear();
          this._router.navigate(['/login'], {
            state: { authError: 'Acesso negado ou erro na autenticação.' }
          });
          return of(null);
        })
      )
      .subscribe();
  }
}
