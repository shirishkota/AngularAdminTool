import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { EmployeeBaseDataComponent } from "./components/employee-base-data/employee-base-data.component";
import { SummaryComponent } from "./components/employee-base-data/summary/summary.component";
import { ViewReportsComponent } from "./components/employee-base-data/view-reports/view-reports.component";
import { OnboardingComponent } from "./components/employee-base-data/onboarding/onboarding.component";
import { OffboardingComponent } from "./components/employee-base-data/offboarding/offboarding.component";
import { TrainingCenterComponent } from "./components/training-center/training-center.component";
import { FinanceComponent } from "./components/finance/finance.component";
import { AddComponent } from "./components/employee-base-data/employee/add/add.component";
import { SearchComponent } from "./components/employee-base-data/employee/search/search.component";
import { PageNotFoundComponent } from "./layout/page-not-found.component";
import { ReportsComponent } from "./components/training-center/reports/reports.component";
import { NewTrainingComponent } from "./components/training-center/new-training/new-training.component";
import { EnrollComponent } from "./components/training-center/enroll/enroll.component";
import { LandingComponent } from "./components/finance/landing/landing.component";
import { ForecastComponent } from "./components/finance/forecast/forecast.component";
import { ActualComponent } from "./components/finance/actual/actual.component";
import { FsDashboardComponent } from "./components/finance/fs-dashboard/fs-dashboard.component";
import { FsAdminComponent } from "./components/finance/fs-admin/fs-admin.component";
import { QualityCenterComponent } from "./components/quality-center/quality-center.component";
import { QualityIndexComponent } from "./components/quality-center/quality-index/quality-index.component";
import { ProjectHealthIndexComponent } from "./components/quality-center/project-health-index/project-health-index.component";
import { MatricsSubmissionComponent } from "./components/quality-center/matrics-submission/matrics-submission.component";
import { DashboardQcComponent } from "./components/quality-center/dashboard-qc/dashboard-qc.component";
import { PhiDashboardComponent } from "./components/quality-center/dashboard-qc/phi-dashboard/phi-dashboard.component";
import { MatricsDashboardComponent } from "./components/quality-center/dashboard-qc/matrics-dashboard/matrics-dashboard.component";
import { AuthorizationGuard } from "./guard/authorization.guard";
import { AuditComponent } from "./components/audits/audit.component";
import { EmployeeManagerComponent } from "./components/employee-manager/employee-manager.component";
import { ProjectAllocationComponent } from "./components/employee-manager/project-allocation/project-allocation.component";
import { EmployeeODCAdminComponent } from "./components/employee-manager/employee-odc-admin/employee-odc-admin.component";
import { ComplianceComponent } from "./components/employee-manager/compliance/compliance.component";
import { EmployeeManagerReportsComponent } from "./components/employee-manager/reports/reports.component";
import { EmployeeLandingComponent } from "./components/employee-manager/employee-landing/employee-landing.component";


const routes: Routes = [
    { path:'', redirectTo:'emp-base-data', pathMatch:'full' },
    {
        path: 'emp-base-data',
        component: EmployeeBaseDataComponent, 
        children: [
            { path: '', redirectTo: 'summary', pathMatch:'full' },
            { path: 'summary', component: SummaryComponent },
            { 
                path: 'viewReports', 
                component: ViewReportsComponent, 
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["DM", "PMO", "PM", "QL", "PL"]
                },
            },
            { 
                path: 'onboarding', 
                component: OnboardingComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "PM", "QL", "PL"]
                }, 
            },
            { 
                path: 'offboarding', 
                component: OffboardingComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "PM", "QL", "PL"]
                }, 
            },
            { 
                path: 'employee',
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "PM", "QL", "PL"]
                },
                children: [
                    { path:'', redirectTo: 'search', pathMatch: 'full'},
                    { path: 'search', component: SearchComponent },
                    { path: 'new', component: AddComponent }
                ]
            },
            
        ]
    },
    { 
        path:'finance', 
        component: FinanceComponent,
        children: [
            { path:'', redirectTo: 'finance-index', pathMatch: 'full'},
            { path: 'finance-index', component: LandingComponent },
            { 
                path: 'forecast-fin', 
                component: ForecastComponent,
                // canActivate: [AuthorizationGuard],
                // data: {
                //     requiredRoles: ["PMO"]
                // },
            },
            { 
                path: 'actuals-fin', 
                component: ActualComponent,
                // canActivate: [AuthorizationGuard],
                // data: {
                //     requiredRoles: ["PMO"]
                // },
            },
            { 
                path: 'dashboard-fin', 
                component: FsDashboardComponent,
                // canActivate: [AuthorizationGuard],
                // data: {
                //     requiredRoles: ["DM", "PMO", "PM", "QL", "PL"]
                // },
            },
            { 
                path: 'admin-fin', 
                component: FsAdminComponent,
                // canActivate: [AuthorizationGuard],
                // data: {
                //     requiredRoles: ["DM", "PMO", "PM"]
                // },
            } 
        ]
    },
    { 
        path:'quality-center', 
        component: QualityCenterComponent,
        children: [
            { path:'', redirectTo: 'quality-index', pathMatch: 'full'},
            { path: 'quality-index', component: QualityIndexComponent },
            {   
                path: 'phi', 
                component: ProjectHealthIndexComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["QL"]
                },
             },
            { 
                path: 'metrics', 
                component: MatricsSubmissionComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "PM", "QL", "PL"]
                },     
             },
            { 
                path: 'dashboard-qc', 
                component: DashboardQcComponent,
                children: [
                    { path:'', redirectTo: 'phi', pathMatch: 'full'},
                    { 
                        path: 'phi', 
                        component: PhiDashboardComponent,
                        canActivate: [AuthorizationGuard],
                        data: {
                            requiredRoles: ["DM", "PMO", "PM", "QL", "PL"]
                        }, 
                     },
                    { 
                        path: 'matrics', 
                        component: MatricsDashboardComponent,
                        canActivate: [AuthorizationGuard],
                        data: {
                            requiredRoles: ["DM", "PMO", "PM", "QL", "PL"]
                        }, 
                    }
                ] 
            } 
        ] 
    },
    { 
        path:'training-center', 
        component: TrainingCenterComponent, 
        children: [
            { path:'', redirectTo: 'reports', pathMatch: 'full'},
            { 
                path: 'reports', 
                component: ReportsComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["DM", "PMO", "PM", "TRNMGR"]
                }, 
            },
            { 
                path: 'new-training', 
                component: NewTrainingComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["DM", "TRNMGR"]
                },
            },
            { 
                path: 'enroll', 
                component: EnrollComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["DM", "PMO", "PM", "TRNMGR", "PL"]
                },
            }
        ]
    },

    { 
        path:'employee-manager', 
        component: EmployeeManagerComponent,
        children: [
            { path:'', redirectTo: 'app-employee-manager', pathMatch: 'full'},
            { 
                path: 'app-employee-manager', 
                component: EmployeeLandingComponent,
            },
            { 
                path: 'project-allocation', 
                component: ProjectAllocationComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "PM"]
                }, 
            },
            { 
                path: 'compliance', 
                component: ComplianceComponent,
                // canActivate: [AuthorizationGuard],
                // data: {
                //     requiredRoles: ["ODCMBR"]
                // },  
            },
            { 
                path: 'employee-odc-admin', 
                component: EmployeeODCAdminComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["PMO", "QL"]
                }, 
             },
            { 
                path: 'reports', 
                component: EmployeeManagerReportsComponent,
                canActivate: [AuthorizationGuard],
                data: {
                    requiredRoles: ["DM", "PMO", "PM", "QL", "PL"]
                }, 
             },
        ]
    },
    
    { path:'audit', component: AuditComponent },

    { path: '**', component: PageNotFoundComponent}
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthorizationGuard
    ],
})

export class AppRoutingModule { }