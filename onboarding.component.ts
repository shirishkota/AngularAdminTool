//Angular Modules
import { Component, OnInit, Input, OnDestroy, ViewChild, ViewContainerRef  } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { AllowedValues } from '../../../models/allowed-values';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
//Models
import { Employee } from '../../../models/employee';
//Services
import { AllowedValuesService } from '../../../services/allowed-values.service';
import { EmployeeService } from '../../../services/employee.service';
import { ProjectService } from '../../../services/project.service';
//utility
import { Utility }  from '../../../utils/utility';
//Observables
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html'
})
export class OnboardingComponent implements OnDestroy, OnInit {
  
  
  onboardingForm: FormGroup;
  locations :AllowedValues[];
  projects :AllowedValues[];
  reasonsForAddition: AllowedValues[];
  isSfOnboardCheckboxFalse: boolean = false;
  isSfOnboardCheckboxTrue: boolean = true;
  errorMessage: string;
  
  private unsubscribe: Subject<boolean> = new Subject();
  
  constructor(
    private employeeService: EmployeeService,
    private allowedvaluesService: AllowedValuesService,
    private projectService: ProjectService,
    private location: Location,
    private _router: Router,
    private _fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.createOnbardingForm();

    this.allowedvaluesService.getAllowedValues()
    .subscribe((response) => {
      this.locations = response['locations'];
      this.projects = response['projects'];
      this.reasonsForAddition = response['reasonsForAddition'];
    })
  }

  createOnbardingForm() {
    this.onboardingForm = this._fb.group({
      kinId: ['', 
        [
          Validators.required, 
          Validators.pattern('[a-zA-Z0-9]{5,10}$')
        ]
      ],
      sfId: [''],
      firstName: [{value:'', disabled: true}], 
      lastName: [{value:'', disabled: true}], 
      capBU: [{value:'', disabled: true}],
      designation: [{value:'', disabled: true}], 
      emailId: [{value:'', disabled: true}],
      mobile: [{value:'', disabled: true}],
      skillSet: [{value:'', disabled: true}],
      odcStartDate: ['',Validators.required],
      location: [''],
      alias: ['', Validators.pattern('[a-zA-Z0-9]{4,4}$')],
      additionReason:['',Validators.required], 
      srsTicketNoNonOprId: ['',Validators.required],
      srsTicketDate:['',Validators.required],
      esSponsor: ['',Validators.required],
      odcNdaFormSignedEvidence: ['',Validators.required],
      odcSaaFormSignedEvidence: ['',Validators.required],
      tokenId: [''],
      tokenIdIssuedDate: [''],
      odcAccessEvidance: ['',Validators.required],
      physicalOdcAccessDate:[''],
      sfOnboardInventory: [''],
      capgeminiManager: [{value:'', disabled: true}],
      projectId: ['',Validators.required],
      projectDesc: [{value:'', disabled: true}],
      expectedBillingDate: ['',Validators.required],
      releaseComponent: [''],
      workOrder: [{value:'', disabled: true}],
      workArea: ['', Validators.pattern('[a-zA-Z0-9_ ]{0,50}$')],
      functions: ['', Validators.pattern('[a-zA-Z0-9_ ]{0,50}$')],
      sfManager: ['', Validators.pattern('[a-zA-Z0-9_ ]{0,50}$')]
    });
  }

  selectLocation(location){
    this.onboardingForm.patchValue({
      location: location
    });
  }

  selectProject(project) :void {
    this.onboardingForm.patchValue({
      projectId: project
    });
  }

  
  onBoardingSubmit() {
    if (this.onboardingForm.valid) {
       let employee :any = {
        sfId: this.onboardingForm.get('sfId').value,
        kinId: this.onboardingForm.get('kinId').value,
        odcStartDate: this.onboardingForm.get('odcStartDate').value,
        odcLocation: this.onboardingForm.get('location').value,
        alias: this.onboardingForm.get('alias').value,
        additionReason: this.onboardingForm.get('additionReason').value,
        srsTicketNoNonOprId: this.onboardingForm.get('srsTicketNoNonOprId').value,
        srsTicketDate: this.onboardingForm.get('srsTicketDate').value,
        esSponsor: this.onboardingForm.get('esSponsor').value,
        odcNdaFormSignedEvidence: this.onboardingForm.get('odcNdaFormSignedEvidence').value,
        odcSaaFormSignedEvidence: this.onboardingForm.get('odcSaaFormSignedEvidence').value,
        tokenId: this.onboardingForm.get('tokenId').value,
        tokenIdIssuedDate: this.onboardingForm.get('tokenIdIssuedDate').value,
        odcAccessEvidance: this.onboardingForm.get('odcAccessEvidance').value,
        physicalOdcAccessDate: this.onboardingForm.get('physicalOdcAccessDate').value,
        sfOnboardInventory : this.onboardingForm.get('sfOnboardInventory').value,
        projectId: this.onboardingForm.get('projectId').value,
        expectedBillingDate: this.onboardingForm.get('expectedBillingDate').value,
        releaseComponent: this.onboardingForm.get('releaseComponent').value,
        functions: this.onboardingForm.get('functions').value,
        workOrder: this.onboardingForm.get('workOrder').value,
        workArea: this.onboardingForm.get('workArea').value,
        sfManager: this.onboardingForm.get('sfManager').value
      }
      if(this.onboardingForm.get('sfId').value == null){
          this.employeeService.onboardEmployee(employee)
          .takeUntil(this.unsubscribe)
          .subscribe((response) => {
            this.toastr.success('Employee On-Boarded Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
            this.enableFileds();
            this.resetform();    
          },(error) => { 
            this.errorMessage = Utility.errorMessageHandling(error);
            this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});    
            });
        }else{
            let kinID = this.onboardingForm.get('kinId').value
            this.employeeService.updateOnboardEmployee(employee, kinID)
            .takeUntil(this.unsubscribe)
            .subscribe((response) => {
              this.toastr.success('Updated Employee On-Board Details Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
              this.enableFileds();
              this.resetform();        
            },(error) => { 
              this.errorMessage = Utility.errorMessageHandling(error);
              this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
          });
        }
    } else {
      Utility.validateFieldsOnSubmit(this.onboardingForm);
    }  
  }
  
  getEmployeeById(empId){
    this.enableFileds();
    this.employeeService.getEmployeeByID(empId)
    .takeUntil(this.unsubscribe)
    .subscribe(employee => {
      this.patchEmployeeDetails(employee);
      this.disableFileds(employee.sfId);
    }, (error) => {
      this.errorMessage = Utility.errorMessageHandling(error);
      this.toastr.error(`${this.errorMessage}`,'Oops!', {toastLife: 10000, showCloseButton: true});
    });
  }

  getProjectDetails(projectId){
    this.projectService.getProjectByID(projectId)
      .takeUntil(this.unsubscribe)
      .subscribe((response) => {
        this.patchProjectDetails(response);
      }, error => { 

      });
  }

  private patchProjectDetails(project: any) :void {
    this.onboardingForm.patchValue({
      projectId: project.projectId,
      projectDesc: project.projectDesc,
      capgeminiManager: project.capgeminiManager,
      workOrder: project.workOrder  
    });
  }

  private patchEmployeeDetails(employee : Employee) :void{

      this.onboardingForm.patchValue({
        //EmployeeDetails
        sfId: employee.sfId,
        firstName: employee.firstName ,
        lastName:  employee.lastName ,
        designation: employee.designation ,
        capBU: employee.capBU,
        emailId: employee.emailAddress,
        mobile: employee.mobile,
        skillSet: employee.skillSet,
        //ODC Details
        odcStartDate: this.datePipe.transform(employee.odcStartDate, 'yyyy-MM-dd'),
        location: (employee.sfId === null)? employee.location : employee.odcLocation,
        alias: employee.alias,
        additionReason: employee.additionReason,
        srsTicketNoNonOprId: employee.srsTicketNoNonOprId,
        srsTicketDate: this.datePipe.transform(employee.srsTicketDate, 'yyyy-MM-dd'),
        esSponsor: employee.esSponsor,
        tokenId: employee.tokenId,
        tokenIdIssuedDate: this.datePipe.transform(employee.tokenIdIssuedDate, 'yyyy-MM-dd'),
        odcNdaFormSignedEvidence: employee.odcNdaFormSignedEvidence,
        odcSaaFormSignedEvidence: employee.odcSaaFormSignedEvidence,
        sfOnboardInventory : (employee.sfOnboardInventory === 'Y')? this.isSfOnboardCheckboxTrue : this.isSfOnboardCheckboxFalse,
        physicalOdcAccessDate: this.datePipe.transform(employee.physicalOdcAccessDate, 'yyyy-MM-dd'),
        odcAccessEvidance: employee.odcAccessEvidance,
        //ProjectDetails
        projectId: employee.projectId,
        projectDesc: employee.projectDesc,
        capgeminiManager: employee.capgeminiManager,
        expectedBillingDate: this.datePipe.transform(employee.expectedBillingDate, 'yyyy-MM-dd'),
        releaseComponent: employee.releaseComponent,
        workOrder: employee.workOrder,
        sfManager: employee.sfManager,
        workArea: employee.workArea,
        functions: employee.functions,
      });
    }

    disableFileds(sfID){
      if(sfID != null){
        this.onboardingForm.get('odcStartDate').disable();
        this.onboardingForm.get('additionReason').disable();
        this.onboardingForm.get('srsTicketNoNonOprId').disable();
        this.onboardingForm.get('srsTicketDate').disable();
        this.onboardingForm.get('odcAccessEvidance').disable();
        this.onboardingForm.get('odcNdaFormSignedEvidence').disable();
        this.onboardingForm.get('odcSaaFormSignedEvidence').disable();
      }  
    }

    enableFileds(){
      this.onboardingForm.get('odcStartDate').enable();
      this.onboardingForm.get('additionReason').enable()
      this.onboardingForm.get('srsTicketNoNonOprId').enable();
      this.onboardingForm.get('srsTicketDate').enable();
      this.onboardingForm.get('odcAccessEvidance').enable();
      this.onboardingForm.get('odcNdaFormSignedEvidence').enable();
      this.onboardingForm.get('odcSaaFormSignedEvidence').enable();
    }

    resetForm(): void{
      this.onboardingForm.reset({
        kinId: ['', 
        [
          Validators.required, 
          Validators.pattern('[a-zA-Z0-9]{5,10}$')
        ]
      ],
      sfId: [''],
      firstName: [{value:'', disabled: true}], 
      lastName: [{value:'', disabled: true}], 
      capBU: [{value:'', disabled: true}],
      designation: [{value:'', disabled: true}], 
      emailId: [{value:'', disabled: true}],
      mobile: [{value:'', disabled: true}],
      skillSet: [{value:'', disabled: true}],
      odcStartDate: ['',Validators.required],
      location: ['',Validators.required],
      alias: [''],
      additionReason:['',Validators.required], 
      srsTicketNoNonOprId: ['',Validators.required],
      srsTicketDate:['',Validators.required],
      esSponsor: ['',Validators.required],
      odcNdaFormSignedEvidence: ['',Validators.required],
      odcSaaFormSignedEvidence: ['',Validators.required],
      tokenId: [''],
      tokenIdIssuedDate: [''],
      odcAccessEvidance: ['',Validators.required],
      physicalOdcAccessDate:[''],
      sfOnboardInventory : ['false'],
      capgeminiManager: [{value:'', disabled: true}],
      projectId: ['',Validators.required],
      projectDesc: [{value:'', disabled: true}],
      expectedBillingDate: ['',Validators.required],
      releaseComponent: [''],
      workOrder: [''],
      workArea: ['', Validators.pattern('[a-zA-Z0-9_ ]{50}$')],
      functions: ['', Validators.pattern('[a-zA-Z0-9_ ]{50}$')],
      sfManager: ['', Validators.pattern('[a-zA-Z0-9_ ]{50}$')]    
      })
    }
  
  
  resetform(){
    this.createOnbardingForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
