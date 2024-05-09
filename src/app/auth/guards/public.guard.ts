import{
  ActivatedRouteSnapshot,
  CanActivateFn,
  CanMatchFn,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';

import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';

const checkAuthStatus = (): boolean | Observable<boolean> => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => console.log('Authenticated: ', isAuthenticated) ),
      tap( isAuthenticated => {
        if( isAuthenticated ) router.navigate(['./'])
      }),
      map( isAuthenticated => !isAuthenticated)
    )

}

export const canActivateGuardPublic: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return checkAuthStatus();
}

export const canMatchGuardPublic: CanMatchFn = (
  route : Route,
  segments: UrlSegment[]
) => {
  return checkAuthStatus();
};
