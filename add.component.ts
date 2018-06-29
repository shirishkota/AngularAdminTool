import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { EmployeeService } from '../../../../services/employee.service';
import { Employee } from '../../../../models/employee';
import { AllowedValuesService } from '../../../../services/allowed-values.service';
import { AllowedValues } from '../../../../models/allowed-values';
import { Utility } from '../../../../utils/utility';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'cg-add-employee',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {

  addEmpForm: FormGroup;
  locations :AllowedValues[];
  skillSets :AllowedValues[];
  errorMessage :string;
  private unsubscribe: Subject<boolean> = new Subject();
  
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private employeeService: EmployeeService,
    private allowedvaluesService: AllowedValuesService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.addEmpCreateForm();

    this.allowedvaluesService.getAllowedValues()
    .subscribe((response) => {
      this.locations = response['locations'];
      this.skillSets = response['skillSets'];
    })
  }

  selectSkillSet(value :string) {
    this.addEmpForm.patchValue({
      skillSets: value
    });
  }

  onSelectedLocation(value : string){
    this.addEmpForm.patchValue({
      location: value
    });
  }

  addEmpCreateForm() :void {
    this.addEmpForm = this.fb.group({
      employeeId: ['', 
        [
          Validators.required, 
          Validators.pattern('[a-zA-Z0-9]{5,10}$')
        ]
      ],
      kinId: ['', 
        [
          Validators.required, 
          Validators.pattern('[a-zA-Z0-9]{5,8}$')
        ]
      ],
      emailAddress: [{value:'', disabled: true}],
      firstName: [{value:'', disabled: true}],
      lastName: [{value:'', disabled: true}],
      designation: [{value:'', disabled: true}],
      capBU:[{value:'',disabled: true}],
      mobile: [{value:'', disabled: true}],
      location: ['', Validators.required],
      skillSets: ['']
    });
  }

  getEmployeeDetails() :void {     
    let employeeId :string = this.addEmpForm.value.employeeId;
    if (employeeId){
    this.employeeService.getEmployeeByCorpID(employeeId)
      .subscribe((employee) => {
      this.setEmloyeeDetail(employee);
      }, (error) => {
        this.errorMessage = Utility.errorMessageHandling(error);
        this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
      });
    }
    else{
      Utility.validateFieldsOnSubmit(this.addEmpForm);
    }
  }

  saveEmployee() {
    if(this.addEmpForm.valid) {
      let employee :any = {
        corpId: this.addEmpForm.get('employeeId').value,
        kinId: this.addEmpForm.get('kinId').value,
        firstName: this.addEmpForm.get('firstName').value,
        lastName: this.addEmpForm.get('lastName').value,
        emailAddress: this.addEmpForm.get('emailAddress').value,
        designation: this.addEmpForm.get('designation').value,
        location: this.addEmpForm.get('location').value,
        skillSets: this.addEmpForm.get('skillSets').value,
        mobile: this.addEmpForm.get('mobile').value,
        capBU: this.addEmpForm.get('capBU').value,
      }
      this.employeeService.saveEmployee(employee)
        .subscribe(() => {
          this.toastr.success('Employee Added Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
          this.resetForm();
          //this.location.back();  
        }, (error) => {
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
          this.resetForm();
        });
    } else {
      Utility.validateFieldsOnSubmit(this.addEmpForm);
    }
  }

  private setEmloyeeDetail(employee :any) :void {
    this.addEmpForm.patchValue({
      emailAddress: employee.emailAddress,
      firstName: employee.firstName,
      lastName: employee.lastName,
      designation: employee.designation,
      capBU: employee.department,
      mobile: employee.mobile,
      location: employee.addressCity
    });
  }

  resetForm(){
    this.addEmpCreateForm();
  }
}
