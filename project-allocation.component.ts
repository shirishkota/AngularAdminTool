import { Component, OnInit, Input, OnDestroy, ViewChild, ViewContainerRef, ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { EmployeeManagerService } from '../../../services/employee-manager.service';
import { AllowedValuesService } from '../../../services/allowed-values.service';
import { ToastsManager } from 'ng2-toastr';
import { Utility } from '../../../utils/utility';

@Component({
  selector: 'app-employee-manager',
  templateUrl: './project-allocation.component.html'
})
export class ProjectAllocationComponent implements OnInit {

  projectAllocationForm: FormGroup;
  newProjectAllocationForm: FormGroup;
  newBillingForm: FormGroup;
  allocatedProjectsList: any[] = [];
  projectBillingStatusList: any[] = []
  projects: any[] = [];
  currentProjects: any[] = [];
  selectedProject: any = '';
  clientRoButton: string = '';
  errorMessage: string;
  billabilityId: string = '';
  employeeDetails: any = '';
  isNewBillable : boolean = false;
  
 
  constructor(
    private _fb : FormBuilder,
    private service: EmployeeManagerService,
    private allowedvaluesService: AllowedValuesService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
    ) { }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.createProjectForm();
    this.createNewProjectAllocationForm(); 
    this.allowedvaluesService.getAllowedValues()
    .subscribe((response) => {
      this.projects = response['projects'];
    });
  }

  createProjectForm(){
    this.projectAllocationForm = this._fb.group({
      kinId: ['', Validators.required],
      sfId: [''],
      empName: [''],
      clientRO: [{value:'', disabled: true}]
    })
  }

  createNewProjectAllocationForm(){
    this.newProjectAllocationForm = this._fb.group({
      sfId: [''],
      projectCode: ['', Validators.required],
      projectName: [{value:'', disabled: true}],
      allocationStartDate: ['', Validators.required],
      allocationEndDate: ['', Validators.required]
    }, {validator: Utility.checkingDates('allocationStartDate','allocationEndDate')});
  }

  createNewBillingForm(){
    this.newBillingForm = this._fb.group({
      billability: ['', Validators.required],
      projectAllocationId: [''],
      billabilityStartDate: ['', Validators.required],
      billabilityEndDate: ['', Validators.required],
      ftecount: ['', [Validators.required, Validators.max(1), Validators.min(0)]]  
    }, {validator: Utility.checkingDates('billabilityStartDate','billabilityEndDate')})
  }

  getAllocatedProjects(){
    this.allocatedProjectsList = [];
    this.currentProjects = [];
    this.employeeDetails = '';
    let employeeId = {  
        kinId : this.projectAllocationForm.get('kinId').value 
      } 
    this.service.getAllocatedProjects(employeeId)
        .subscribe((employee)=>{
            this.projectAllocationForm.patchValue({
              sfId: employee.sfId,
              empName: employee.empName,
              clientRO: employee.clientRO,
             })
          this.employeeDetails = employee;
          this.allocatedProjectsList = employee.projectAllocationList; 
          if( this.allocatedProjectsList.length === 0){
            this.toastr.error(`Error Message: no project allocated to the employee`,'Error!', {toastLife: 10000, showCloseButton: true});
           } else{
            this.allocatedProjectsList.forEach(element => {
              this.currentProjects.push(element.projectCode)
            });   
            this.clientRoButton = 'Edit' 
          }      
        }, (error)=>{
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
        })
    
  }

  //POST --> Client RO Details
  editClientRO(){
    if(this.clientRoButton === 'Edit'){
      this.projectAllocationForm.get('clientRO').enable();
      this.clientRoButton = 'Save'
    } else{
      this.service.saveClientRO(this.projectAllocationForm.getRawValue())
        .subscribe((result)=>{
          this.projectAllocationForm.get('clientRO').disable();
          this.clientRoButton = 'Edit'
          this.toastr.success('Updated Client RO Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
        }, (error)=>{
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
        })
    }
  }

  //GET -->Project Name for New Project Allocation
  getProjectDetails(projectId){
    this.projects.forEach((project) => {
      if(project.id == projectId){
        this.newProjectAllocationForm.patchValue({
          sfId: this.projectAllocationForm.get('sfId').value,
          projectName: project.displayName
        })
      }
    });  
  }

  //POST -->New Project Deatils
  newProjectAlocation(){
    this.service.newProjectAllocation(this.newProjectAllocationForm.getRawValue())
      .subscribe((result)=>{
        this.toastr.success('Added New Project Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
        this.getAllocatedProjects();
        this.resetNewAllocationForm()
      }, (error)=>{
        this.errorMessage = Utility.errorMessageHandling(error);
        this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
        this.resetNewAllocationForm()
      });
  }

  //GET -->Billing Details of Particluar Project
  getAllocatedProjectDetails(projectAllocationId : string, project: any){
    this.projectBillingStatusList = [];
    this.billabilityId = '';
    this.isNewBillable = false;
    this.selectedProject = project;
    this.service.getAlocatedProjectDetails(projectAllocationId)
        .subscribe((response)=>{
          this.projectBillingStatusList = response;
        }, (error)=>{
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
      });
  }

  
  editProjectBilling(billabilityId){  
    this.billabilityId = billabilityId;
  }

  validateDate(startDate, endDate): boolean{
    if(new Date(startDate) < new Date(endDate)){
      return true;
    } else{
      return false;
    }
  }

  //POST --> Edited Billing Details
  saveProjectBilling(projectAllocationId, projectAllocationBillabilityId){
    let billingStatus = this.projectBillingStatusList.filter((project)=> {
      if(project.projectAllocationBillabilityId === projectAllocationBillabilityId) {
       return project;
      }    
    });
    this.service.saveProjectBilling(billingStatus[0])
    .subscribe((response)=>{
      this.billabilityId = null;
      this.toastr.success('Edited Billing Details Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
    }, (error)=>{
      this.errorMessage = Utility.errorMessageHandling(error);
      this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
    });
  }

  newProjectBilling(){
    this.isNewBillable = true
    this.createNewBillingForm();
  }

  //POST --> New Billing Details
  saveNewProjectBilling(projectAllocationId){
    this.newBillingForm.patchValue({
      projectAllocationId: projectAllocationId
    })
    this.service.saveProjectBilling(this.newBillingForm.getRawValue())
        .subscribe((result)=>{
          this.toastr.success('Added New Billing Details Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
          this.isNewBillable = false;
          this.getAllocatedProjectDetails(this.newBillingForm.get('projectAllocationId').value, this.selectedProject);
          this.resetNewBillingForm();
        }, (error)=>{
          this.errorMessage = Utility.errorMessageHandling(error);
          this.toastr.error(`${this.errorMessage}`,'Error!', {toastLife: 10000, showCloseButton: true});
      })
  }

  
  resetProjectForm(){
    this.createProjectForm();  
    this.employeeDetails = '';
    this.allocatedProjectsList = [];
  }

  resetNewAllocationForm(){
    this.createNewProjectAllocationForm();
  }

  resetNewBillingForm(){
    this.createNewBillingForm();
  }
}
