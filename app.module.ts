import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppRoutingModule } from './app-routes.module';

import { AppComponent } from './app.component';

import { SelectDataComponent } from './common/select-data/select-data.component';

import { PageNotFoundComponent } from './layout/page-not-found.component';
import { AdminHeaderComponent } from './layout/admin-header/admin-header.component';
import { AdminFooterComponent } from './layout/admin-footer/admin-footer.component';
import { MenuComponent } from './layout/menu/menu.component';

import { EmployeeBaseDataComponent } from './components/employee-base-data/employee-base-data.component';
import { SummaryComponent } from './components/employee-base-data/summary/summary.component';
import { ViewReportsComponent } from './components/employee-base-data/view-reports/view-reports.component';
import { OnboardingComponent } from './components/employee-base-data/onboarding/onboarding.component';
import { OffboardingComponent } from './components/employee-base-data/offboarding/offboarding.component';
import { SearchComponent } from './components/employee-base-data/employee/search/search.component';
import { AddComponent } from './components/employee-base-data/employee/add/add.component';

import { FinanceComponent } from './components/finance/finance.component';
import { LandingComponent } from './components/finance/landing/landing.component';
import { ForecastComponent } from './components/finance/forecast/forecast.component';
import { ActualComponent } from './components/finance/actual/actual.component';
import { FsAdminComponent } from './components/finance/fs-admin/fs-admin.component';
import { FsDashboardComponent } from './components/finance/fs-dashboard/fs-dashboard.component';

import { QualityCenterComponent } from './components/quality-center/quality-center.component';
import { QualityIndexComponent } from './components/quality-center/quality-index/quality-index.component';
import { ProjectHealthIndexComponent } from './components/quality-center/project-health-index/project-health-index.component';
import { MatricsSubmissionComponent } from './components/quality-center/matrics-submission/matrics-submission.component';
import { DashboardQcComponent } from './components/quality-center/dashboard-qc/dashboard-qc.component';
import { PhiDashboardComponent } from "./components/quality-center/dashboard-qc/phi-dashboard/phi-dashboard.component";
import { MatricsDashboardComponent } from "./components/quality-center/dashboard-qc/matrics-dashboard/matrics-dashboard.component";

import { TrainingCenterComponent } from './components/training-center/training-center.component';
import { ReportsComponent } from './components/training-center/reports/reports.component';
import { EnrollComponent } from './components/training-center/enroll/enroll.component';
import { NewTrainingComponent } from './components/training-center/new-training/new-training.component';

import { AllowedValuesService } from './services/allowed-values.service';
import { EmployeeService } from './services/employee.service';
import { SearchService } from './services/search.service';
import { ProjectService } from './services/project.service';
import { TrainingService } from './services/training.service';
import { FinanceService } from './services/finance.service';
import { QualityService } from './services/quality.service';
import { AuthGuardService } from './services/authGuard.service';
import { EmployeeManagerService } from './services/employee-manager.service';

// import { AuthorizationGuard } from './guard/authorization.guard';
import { AuditComponent } from './components/audits/audit.component';
import { AuditService } from './services/audit.service';
import { EmployeeManagerComponent } from './components/employee-manager/employee-manager.component';

import { ProjectAllocationComponent } from './components/employee-manager/project-allocation/project-allocation.component';
import { ComplianceComponent } from './components/employee-manager/compliance/compliance.component';
import { EmployeeODCAdminComponent } from './components/employee-manager/employee-odc-admin/employee-odc-admin.component';
import { EmployeeManagerReportsComponent } from './components/employee-manager/reports/reports.component';
import { EmployeeLandingComponent } from './components/employee-manager/employee-landing/employee-landing.component';
//import { SecuredDirective } from './directives/secured.directive';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeBaseDataComponent,
    SummaryComponent,
    ViewReportsComponent,
    OnboardingComponent,
    OffboardingComponent,
    FinanceComponent,
    QualityCenterComponent,
    TrainingCenterComponent,
    SelectDataComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    MenuComponent,
    SearchComponent,
    AddComponent,
    PageNotFoundComponent,
    ReportsComponent,
    EnrollComponent,
    NewTrainingComponent,
    LandingComponent,
    ForecastComponent,
    ActualComponent,
    FsAdminComponent,
    FsDashboardComponent,
    QualityIndexComponent,
    ProjectHealthIndexComponent,
    MatricsSubmissionComponent,
    DashboardQcComponent,
    PhiDashboardComponent,
    MatricsDashboardComponent,
    AuditComponent,
    EmployeeManagerComponent,
    EmployeeManagerComponent,
    ProjectAllocationComponent,
    EmployeeODCAdminComponent,
    ComplianceComponent,
    EmployeeManagerReportsComponent,
    EmployeeLandingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    ToastModule.forRoot()
  ],
  providers: [
    AllowedValuesService,
    EmployeeService,
    ProjectService,
    DatePipe,
    TrainingService,
    FinanceService,
    QualityService,
    AuthGuardService,
    AuditService,   
    EmployeeManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
