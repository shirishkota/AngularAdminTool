import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllowedValuesService } from './services/allowed-values.service';
import { AuthGuardService } from './services/authGuard.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  
  constructor(
    private authService: AuthGuardService
  ) {}
  
  ngOnInit(): void {
    localStorage.removeItem('userRoles');
    let roles: any[] =[];
    this.authService.getCurrentUserRole().subscribe((userRoles) => {
      userRoles.roles.forEach((role, index) => {
        roles[index] = role.roleType;
        localStorage.setItem('userRoles', JSON.stringify(roles));
      });
    });
  }
  
  ngOnDestroy(): void {
    localStorage.removeItem('userRoles');
  }
  
}
