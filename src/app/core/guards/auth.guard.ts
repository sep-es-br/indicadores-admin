import {
  CanActivateChildFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateChildFn = (route, state) => {
  const storageToken = sessionStorage.getItem('token');

  if (!!storageToken) {
    return true;
  }

  const router = new Router();  
  router.navigateByUrl('/login', {
    state: { authError: 'Você precisa estar logado para acessar essa página.' }
  });

  return false;
};
