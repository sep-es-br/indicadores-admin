import {
  CanActivateChildFn,
  Router
} from '@angular/router';
import { ProfileService } from '../service/profile.service';
import { inject } from '@angular/core';
import { IProfile } from '../interfaces/profile.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';
import { of } from 'rxjs';

export const authGuard: CanActivateChildFn = (route, state) => {

  const router = inject(Router);
  const profileService = inject(ProfileService);
  const toastrService = inject(NbToastrService);
  const urlToken = route.queryParamMap.get('urlToken'); 

  if (urlToken) {
    sessionStorage.setItem('token', urlToken); 

    return profileService.getTokenInfo(urlToken).pipe(
      tap((response: IProfile) => {
        
        const userProfile = {
          name: response.name,
          email: response.email,
          role: response.role,
        };
        console.log(userProfile)
        if (!response.role.includes('INDICADORES_ADMIN')) {
          toastrService.show(
            'Acesso negado: Você não tem permissão para acessar essa aplicação',
            'Atenção',
            { status: 'warning', duration: 8000 }
          );
          sessionStorage.clear(); 
          router.navigate(['/login']); 
          return; 
        }

        sessionStorage.setItem('user-profile', JSON.stringify(userProfile));
        router.navigate([state.url.split('?')[0]], {
          queryParams: {}, 
          replaceUrl: true, 
        });
      }),
      catchError(() => {
        toastrService.show(
          'Erro ao obter informações do usuário',
          'Atenção',
          { status: 'warning', duration: 8000 }
        );
        sessionStorage.clear();
        router.navigate(['/login']);
        return of(false); 
      }),
      map(() => true) 
    );
  }

  const storageToken = sessionStorage.getItem('token');
  
  if (!storageToken) {
    router.navigateByUrl('/login', {
      state: { authError: 'Você precisa estar logado para acessar essa página.' },
    });
    return false; 
  }


  return true; 
};
