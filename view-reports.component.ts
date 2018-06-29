import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AllowedValues } from '../../../models/allowed-values';
import { Employee } from '../../../models/employee';

import { EmployeeService } from '../../../services/employee.service';
import { AllowedValuesService } from '../../../services/allowed-values.service';

import { Utility } from '../../../utils/utility';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html'
})
export class ViewReportsComponent implements OnInit {
  reportForm: FormGroup;
  reportNameForm: FormGroup;
  searchResult: Employee[] = [];
  report: string;
  errorMessage: string;
  searchBy: string = "date";
  
  private unsubscribe: Subject<boolean> = new Subject();
  
  constructor(
    private _fb: FormBuilder,
    private employeeService: EmployeeService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.createViewReportForm();
    this.searcByNameForm();
  }

  createViewReportForm(){
    this.reportForm = this._fb.group({
      startDate:[null, Validators.required ],
      endDate: [null, Validators.required ],
      reportType: ['onboarding'],
      location: ['all'],
      searchBy: ['date']
    })
  }

  searcByNameForm(){
    this.reportNameForm = this._fb.group({
      firstName:['', Validators.pattern('[a-zA-Z0-9 ]{0,25}$')],
      lastName: ['', Validators.pattern('[a-zA-Z0-9 ]{0,25}$')],
      kinId: ['', Validators.pattern('[a-zA-Z0-9]{0,8}$')],
      reportType: ['onboarding',Validators.required],
      searchBy: ['name']
    })
  }

  employeeExportToExcel(table) {
    let uri = 'data:application/vnd.ms-excel;base64,';
    let template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
    let base64 = function(s) { 
      return window.btoa(decodeURIComponent(encodeURIComponent(s))); 
    }
    let format = function(s, c) { 
      return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }); 
    }
    if (!table.nodeType) {
      table = document.getElementById(table);
    } 
    let ctx = {worksheet: 'Employee_List', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx));
      
    return false;
  }

  searchPerform(): void {
    if (this.reportForm.valid) {
      let searchCriteria = this.reportForm.getRawValue();
      this.report = this.reportForm.get('reportType').value;
      this.employeeService.searchEmployee(searchCriteria)
        .takeUntil(this.unsubscribe)
        .subscribe((result) => {
          this.searchResult = result;
        }, (error) => {
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
        });
    } else {
      Utility.validateFieldsOnSubmit(this.reportForm);
    }
  }

  searchNamePerform() : void {
    if (this.reportNameForm.get('firstName').value == '' && this.reportNameForm.get('lastName').value == '' && this.reportNameForm.get('kinId').value == '') {
      this.toastr.error(`Please enter atlest one search criteria`,'Oops!', {toastLife: 10000, showCloseButton: true});    
    } else {
      let searchCriteria = this.reportNameForm.getRawValue();
      this.report = this.reportNameForm.get('reportType').value;
      this.employeeService.searchEmployee(searchCriteria)
      .takeUntil(this.unsubscribe)
      .subscribe((result) => {
        this.searchResult = result;
        if( this.searchResult.length == 0){
          this.toastr.error(`No records found for this search criteria`,'Oops!', {toastLife: 10000, showCloseButton: true}); 
        }
      }, (error) => {
        this.errorMessage = Utility.errorMessageHandling(error);
        this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
      });
    }
  }

  SearchByCriteria(criteria) :void{
    this.searchBy = criteria;
    this.errorMessage = null;
    this.searchResult = [];
  }

  resetNameForm(): void {
    this.searcByNameForm();
  }

  resetForm(): void{
     this.reportForm.reset({
      startDate:[null, Validators.required ],
      endDate: [null, Validators.required ],
      reportType: ['onboarding'],
      location: ['all'],
      searchBy: ['date']
     })
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
