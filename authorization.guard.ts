import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthorizationGuard implements CanActivate {

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = next.data.requiredRoles;
    let userRoles : any[] = JSON.parse(localStorage.getItem('userRoles'));
    let count : number = 0;
    if(userRoles!= null) {
    userRoles.forEach(role => {
      if(requiredRoles.includes(role)){
        count++;
      } 
    });
  }
   if(count>0) {
      return true;
   } else {
      alert("You are not Authorized to Access!")
      return false;
   }
     
  }
}
