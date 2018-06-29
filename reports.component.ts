import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AllowedValuesService } from '../../../services/allowed-values.service';
import { AllowedValues } from '../../../models/allowed-values';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeManagerService } from '../../../services/employee-manager.service';
import { ToastsManager } from 'ng2-toastr';
import { Utility } from '../../../utils/utility';

@Component({
  selector: 'app-employee-manager',
  templateUrl: './reports.component.html'
})
export class EmployeeManagerReportsComponent implements OnInit {

  constructor(
    private allowedvaluesService: AllowedValuesService,
    private employeeManager: EmployeeManagerService,
    private _fb: FormBuilder,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  projects: AllowedValues[] = [];
  projectReport: any[] = [];
  reportForm: FormGroup;
  errorMessage: string = null; 

  ngOnInit() {
    this.createReportForm();
    this.toastr.setRootViewContainerRef(this.vcr);
    this.allowedvaluesService.getAllowedValues()
    .subscribe((response) => {
      this.projects = response['projects'];
    });
  }
  createReportForm(){
    this.reportForm = this._fb.group({
      projectId: [null, Validators.required]
    }); 
  }

  getProjectReports(): void {
    if (this.reportForm.valid) {
      this.employeeManager.getProjectReport(this.reportForm.value.projectId)
        .subscribe((result) => {
          this.resetAudit();
          this.projectReport = result;
        }, (error) => {
          this.resetAudit();
          this.errorMessage = Utility.errorMessageHandling(error)
          this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true})
        });
    }
  }

  resetAudit(): void {
    //this.createReportForm(); 
    this.projectReport = [];
  }

}
