import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Tablet = 'tablet',
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const claims = localStorage.getItem('claims');
    const id = localStorage.getItem('id');
    const role = localStorage.getItem('role');

    if (claims && id && role) {
      const userRole = role as UserRole;
      const allowedRoles = route.data['allowedRoles'] as UserRole[];

      if (allowedRoles.includes(userRole)) {
        return true;
      } else {
        this.router.navigate(['/**']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
