import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Employee } from '../models/employee';
import { environment } from '../../environments/environment';
import { EmployeeService } from './employee.service';

@Injectable()
export class EmployeeManagerService {
    private readonly apiURL = environment.apihost; 
    //private readonly apiURL = 'http://localhost:8080/synergyadminservice/service/'; 

    constructor(
        private httpClient: HttpClient
    ) { }

    getProjectReport(projectId :string) :Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiURL}employeemanager/report?projectCode=${projectId}`);   
    }

    //Get Allocation project by KIN Id
    getAllocatedProjects(employeeId){
        return this.httpClient.get<any>(`${this.apiURL}employeemanager/projectallocation`, { params: employeeId });
    }

    getAlocatedProjectDetails(allocationId){
        return this.httpClient.get<any>(`${this.apiURL}employeemanager/projectallocation/details?projectAllocationId=${allocationId}`);
    }

    saveClientRO(projectClientRo){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/projectallocation/sf-manager/${projectClientRo.sfId}`, projectClientRo);
    }

    newProjectAllocation(projectDetails){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/projectallocation/${projectDetails.sfId}`, projectDetails);
    }

    saveProjectBilling(projectBilling){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/projectallocation/details`, projectBilling);
    }

    resetSFTrainings(sfid){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/odcadmin/reset-client-training/${sfid}`,{});
    }

    resetAllClientTrainings()
    {
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/odcadmin/reset-client-training`,{});
    }

    resetAllCGTrainings()
    {
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/odcadmin/reset-cg-training`,{});
    }

    resetCGTrainings(sfid){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/odcadmin/reset-cg-training/${sfid}`,{});
    }

    getEmployeeLockDetails(kinId){
        return this.httpClient.get<any>(`${this.apiURL}employeemanager/odcadmin`, { params: kinId });
    }

    getComplianceData(){
        return this.httpClient.get<any>(`${this.apiURL}employeemanager/compliance`);
    }

    updateTrainingFlags(employeeCompliance :any) :Observable<any> {
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/compliance/training-flags`, employeeCompliance);
    }

    updateAccessRenewalDate(employeeCompliance :any) :Observable<any> {
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/compliance/acces-renewal-date`, employeeCompliance);
    }

    updateEmployeeLockDetails(odcAdmin :any,sfid){
        return this.httpClient.post<any>(`${this.apiURL}employeemanager/odcadmin/${sfid}`,odcAdmin);
    }
}