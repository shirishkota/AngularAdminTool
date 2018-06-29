import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AllowedValues } from '../models/allowed-values';

import { Employee } from '../models/employee';
import { environment } from '../../environments/environment';

@Injectable()
export class EmployeeService {

    private readonly corpURL= environment.corpHost;
    private readonly apiURL = environment.apihost; 

    constructor(
        private httpClient: HttpClient
    ) { }


    getLoggedInUser() :Observable<any> {
        return this.httpClient.get<any>(`${this.corpURL}currentlyLoggedInUser`);      
    }

    //get the empoyee details from capgemini DB
    getEmployeeByCorpID(corpID :string) :Observable<any> {
        return this.httpClient.get<any>(`${this.corpURL}${corpID}`);      
    }

    //Post the employee details to Admin Tool DB 
    saveEmployee(employee: Employee) :Observable<Employee> {
        return this.httpClient.post<Employee>(`${this.apiURL}employees`, employee);
    }

    //Get the addded empoyee details from AdminTool DB
    searchAddedEmployee(employee: any) :Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiURL}employees`, { params: employee });
    }

    //Get the reports for view&Reports page
    searchEmployee(employee: any) :Observable<any[]> {
        return this.httpClient.get<any[]>(`${this.apiURL}employees/reports`, { params: employee });
    }

    //Get the Employee Deatils to Onboard 
    getEmployeeByID(empID :string) :Observable<Employee> {
        return this.httpClient.get<Employee>(`${this.apiURL}onboarding/${empID}`);      
     }

    //Post the Employee Onboard Details
    onboardEmployee(employee :Employee) :Observable<Employee> {
        return this.httpClient.post<Employee>(`${this.apiURL}onboarding`, employee);      
     }

    //Update the Employee Onboard Details
    updateOnboardEmployee(employee :Employee, kinid :string) :Observable<Employee> {
        return this.httpClient.post<Employee>(`${this.apiURL}onboarding/${kinid}`, employee);      
     }

     //Get the Employee Offboard Details
     getEmployeeById(empID :string) :Observable<Employee> {
        return this.httpClient.get<Employee>(`${this.apiURL}offboarding/${empID}`);      
     }

     //update the Employee Offboard Details
     offboardEmployee(employee :Employee, kinid :string) :Observable<Employee> {
        return this.httpClient.post<Employee>(`${this.apiURL}offboarding/${kinid}`, employee);      
     }

}